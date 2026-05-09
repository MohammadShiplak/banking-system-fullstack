using DataAccessLayer_BankManagementSystem.Data;
using DataAccessLayer_BankManagementSystem.DTO.Auth;
using DataAccessLayer_BankManagementSystem.Entities;
using DataAccessLayer_BankManagementSystem.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;
using Back_End_Bank_Management_System.Auth;
using Azure.Core;
using Microsoft.AspNetCore.RateLimiting;
using DataAccessLayer_BankManagementSystem.DTO;

namespace Back_End_Bank_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AuthController : ControllerBase
    {
        private readonly IUserRepository<User> _userRepository;
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _configuration;



        private readonly ApplicationDbContext _context;



        public AuthController(IUserRepository<User> userRepository, ApplicationDbContext context, ILogger<AuthController> logger, IConfiguration configuration)
        {

            _userRepository = userRepository;

            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        private static string GenerateRefreshToken()
        {
            var bytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }




        [HttpPost("login")]

        [EnableRateLimiting("AuthLimiter")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var jwtKey = _configuration["JWT_SECRET_KEY"];
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            var user = _context.Users.FirstOrDefault(s => s.Email == request.Email);

            if (user == null)
            {
                _logger.LogWarning(
                "Failed login attempt (email not found). Email={Email}, IP={IP}",
                request.Email,
                ip
                );

                return Unauthorized("Invalid credentials");
            }

            bool isValidPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (user == null)
            {
                _logger.LogWarning(
                "Failed login attempt (email not found). Email={Email}, IP={IP}",
                request.Email,
                ip
                );

                return Unauthorized("Invalid credentials");
            }

            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email,          user.Email),
        new Claim(ClaimTypes.Role,           user.Role)
    };
           
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "BankAPI",
                audience: "BankAPIManagementSystem",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
            );

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

            // Generate raw refresh token
            var rawRefreshToken = GenerateRefreshToken();

            // ✅ CORRECT: save RAW to RefreshToken, HASH to RefreshTokenHash
            user.RefreshToken = rawRefreshToken;                                  // ← raw
            user.RefreshTokenHash = BCrypt.Net.BCrypt.HashPassword(rawRefreshToken);  // ← hash
            user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(7);
            user.RefreshTokenRevokedAt = null;

            _context.SaveChanges();

            // ─────────────────────────────────────────
            // ✅ Store refresh token in HttpOnly Cookie
            // HttpOnly = JavaScript CANNOT read this
            // Secure   = HTTPS only
            // SameSite = Protects against CSRF attacks
            // ─────────────────────────────────────────
            Response.Cookies.Append("refreshToken", rawRefreshToken, new CookieOptions
            {

                HttpOnly = true,//JS can not access this
                Secure = true,// HTTP only
                SameSite = SameSiteMode.Strict,//CSRF as token expiry
                Expires = DateTime.UtcNow.AddDays(7),// same as token expiry
                Path = "/api/Auth"// only sent to auth endpoints
            });



            _logger.LogInformation("Successful login, userId={userId}, Email={Email},IP={IP}",
                user.Id,
                user.Email,
                ip);



            // only return accessToken in response body
            // refresh token is in cookie not Json

            return Ok(new
            {
                AccessToken = accessToken,
                email = user.Email,
                role = user.Role,

            });
        }


        [HttpPost("refresh")]
        public IActionResult Refresh([FromBody] RefreshRequest request)
        {

            var jwtKey = _configuration["JWT_SECRET_KEY"];
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";





            // ✅ Read refresh token FROM COOKIE — not from request body
            // Browser sends it automatically with every request

            var refreshToken = Request.Cookies["refreshToken"];

            // ✅ Read email from the EXPIRED access token
            // We still need to find the use
            var email = Request.Headers["X-User-Email"].ToString();



            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

            if (user == null)
            {
                _logger.LogWarning(
                    "Invalid refresh attempt (email not found). Email={Email}, IP={IP}",
                    request.Email,
                    ip
                );

                return Unauthorized("Invalid refresh request");
            }


            if (user.RefreshTokenRevokedAt != null)
            {
                _logger.LogWarning(
                            "Refresh attempt using revoked token. UserId={UserId}, Email={Email}, IP={IP}",
                            user.Id,
                            user.Email,
                            ip
                        );



                return Unauthorized("Refresh token was revoked, please login again");
            }
                

            if (user.RefreshTokenExpiresAt == null ||
                user.RefreshTokenExpiresAt <= DateTime.UtcNow)
            {
                _logger.LogWarning(
           "Invalid refresh token attempt. UserId={UserId}, Email={Email}, IP={IP}",
           user.Id,
           user.Email,
           ip
       );


                return Unauthorized("Refresh token expired, please login again");
            }
              

            // ✅ FIX: check if RefreshTokenHash is null BEFORE calling BCrypt
            // If null → user logged in with old code → force them to login again
            if (string.IsNullOrEmpty(user.RefreshTokenHash))
                return Unauthorized("Session invalid, please login again");

            // Now safe to call BCrypt — hash is guaranteed not null
            bool refreshValid = BCrypt.Net.BCrypt.Verify(
                request.RefreshToken,
                user.RefreshTokenHash
            );

            if (!refreshValid)
                return Unauthorized("Invalid refresh token");

            // Generate new tokens
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email,          user.Email),
        new Claim(ClaimTypes.Role,           user.Role)
    };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var jwt = new JwtSecurityToken(
                issuer: "BankAPI",
                audience: "BankAPIManagementSystem",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
            );

            var newAccessToken = new JwtSecurityTokenHandler().WriteToken(jwt);
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenHash = BCrypt.Net.BCrypt.HashPassword(newRefreshToken);
            user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(7);
            user.RefreshTokenRevokedAt = null;

            _context.SaveChanges();

            // ✅ Set new refresh token in HttpOnly cookie
            Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7),
                Path = "/api/Auth"
            });

            // ✅ Return only new access token
            return Ok(new { accessToken = newAccessToken });
        }


        [HttpPost("register")]
        public async Task<IActionResult> register(RegisterDTO userDTO)
        {
            // Validate
            if (string.IsNullOrEmpty(userDTO.Password))
                return BadRequest("Password is required");

            // Build User with hashed password
            var newUser = new User
            {
                UserName = userDTO.UserName,
                Email = userDTO.Email,
                Role = "Teller",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDTO.Password)
            };

            // ✅ Save newUser — NOT userDTO
            var savedUser = await _userRepository.AddUsersAsync(newUser);

            // ✅ Return safe response — never return password
            return Ok(new
            {
                savedUser.Id,
                savedUser.UserName,
                savedUser.Email,
                savedUser.Role
            });
        }
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
        {

            // Read from cookie

            var refreshToken = Request.Cookies["refreshToken"];
            var email = Request.Headers["X-User-Email"].ToString();

            if (!string.IsNullOrEmpty(refreshToken) && !string.IsNullOrEmpty(email))
            {
                var user = await _userRepository.GetUserByRefreshTokenAsync(request.Email);

                if (user != null)
                {
                    await _userRepository.RevokeRefreshTokenAsync(user);
                    await _context.SaveChangesAsync();



                }
            }
            Response.Cookies.Delete("refreshToken", new CookieOptions
            {


                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Path = "/api/Auth"



            });
            return Ok("Logged out successfully");
        }
    }
}
