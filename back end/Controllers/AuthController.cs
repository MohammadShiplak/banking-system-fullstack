using Back_End_Bank_Management_System.Auth;
using DataAccessLayer_BankManagementSystem.Data;
using DataAccessLayer_BankManagementSystem.DTO;
using DataAccessLayer_BankManagementSystem.DTO.Auth;
using DataAccessLayer_BankManagementSystem.Entities;
using DataAccessLayer_BankManagementSystem.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

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

        public AuthController(
            IUserRepository<User> userRepository,
            ApplicationDbContext context,
            ILogger<AuthController> logger,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        // ─── Helper: Generate Refresh Token ──────────────────────
        private static string GenerateRefreshToken()
        {
            var bytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }

        // ─── Helper: Get JWT Key (validated) ─────────────────────
        private string GetJwtKey() =>
            _configuration["JWT_SECRET_KEY"]
            ?? throw new InvalidOperationException(
                "JWT_SECRET_KEY is not configured.");

        // ─── Helper: Build JWT Token ──────────────────────────────
        private string BuildJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email,          user.Email),
                new Claim(ClaimTypes.Role,           user.Role),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(GetJwtKey()));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "BankAPI",
                audience: "BankAPIManagementSystem",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ─── Helper: Set Refresh Token Cookie ────────────────────
        private void SetRefreshTokenCookie(string token)
        {
            Response.Cookies.Append("refreshToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7),
                Path = "/api/Auth"
            });
        }

        // ─────────────────────────────────────────────────────────
        // POST /api/Auth/login
        // ─────────────────────────────────────────────────────────
        [HttpPost("login")]
        [AllowAnonymous]
        [EnableRateLimiting("AuthLimiter")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // ✅ Validate model
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            // ✅ Step 1 — Find user by email
            var user = _context.Users
                .FirstOrDefault(u => u.Email == request.Email);

            if (user == null)
            {
                _logger.LogWarning(
                    "Login failed - email not found. Email={Email}, IP={IP}",
                    request.Email, ip);

                // ✅ Same message for email and password — prevents user enumeration
                return Unauthorized("Invalid credentials");
            }

            // ✅ Step 2 — Verify password (THIS WAS MISSING BEFORE!)
            bool isValidPassword = BCrypt.Net.BCrypt
                .Verify(request.Password, user.PasswordHash);

            if (!isValidPassword)
            {
                _logger.LogWarning(
                    "Login failed - wrong password. Email={Email}, IP={IP}",
                    request.Email, ip);

                return Unauthorized("Invalid credentials");
            }

            // ✅ Step 3 — Generate tokens
            var accessToken = BuildJwtToken(user);
            var rawRefreshToken = GenerateRefreshToken();

            // ✅ Step 4 — Save ONLY hash (never raw token!)
            user.RefreshToken = null;  // ← don't store raw
            user.RefreshTokenHash = BCrypt.Net.BCrypt.HashPassword(rawRefreshToken);
            user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(7);
            user.RefreshTokenRevokedAt = null;

            // ✅ Step 5 — Async save
            await _context.SaveChangesAsync();

            // ✅ Step 6 — Set refresh token in HttpOnly cookie
            SetRefreshTokenCookie(rawRefreshToken);

            _logger.LogInformation(
                "Login successful. UserId={UserId}, Email={Email}, IP={IP}",
                user.Id, user.Email, ip);

            // ✅ Return only access token — refresh token is in cookie
            return Ok(new
            {
                accessToken,
                email = user.Email,
                role = user.Role,
            });
        }

        // ─────────────────────────────────────────────────────────
        // POST /api/Auth/refresh
        // ─────────────────────────────────────────────────────────
        [HttpPost("refresh")]
        [EnableRateLimiting("AuthLimiter")]   // ✅ Added rate limiting
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            // ✅ Step 1 — Read refresh token FROM COOKIE only
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized("No refresh token found");

            // ✅ Step 2 — Find user
            var user = _context.Users
                .FirstOrDefault(u => u.Email == request.Email);

            if (user == null)
            {
                _logger.LogWarning(
                    "Refresh failed - user not found. Email={Email}, IP={IP}",
                    request.Email, ip);

                return Unauthorized("Invalid refresh request");
            }

            // ✅ Step 3 — Check if token was revoked
            if (user.RefreshTokenRevokedAt != null)
            {
                _logger.LogWarning(
                    "Revoked token used. UserId={UserId}, IP={IP}",
                    user.Id, ip);

                return Unauthorized("Token revoked. Please login again.");
            }

            // ✅ Step 4 — Check expiry
            if (user.RefreshTokenExpiresAt <= DateTime.UtcNow)
            {
                _logger.LogWarning(
                    "Expired refresh token. UserId={UserId}, IP={IP}",
                    user.Id, ip);

                return Unauthorized("Refresh token expired. Please login again.");
            }

            // ✅ Step 5 — Validate hash exists
            if (string.IsNullOrEmpty(user.RefreshTokenHash))
                return Unauthorized("Session invalid. Please login again.");

            // ✅ Step 6 — Verify cookie token against stored hash
            bool refreshValid = BCrypt.Net.BCrypt
                .Verify(refreshToken, user.RefreshTokenHash);
            //          ^ cookie token, not request body!

            if (!refreshValid)
            {
                _logger.LogWarning(
                    "Invalid refresh token. UserId={UserId}, IP={IP}",
                    user.Id, ip);

                return Unauthorized("Invalid refresh token");
            }

            // ✅ Step 7 — Generate new tokens (rotation)
            var newAccessToken = BuildJwtToken(user);
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = null;
            user.RefreshTokenHash = BCrypt.Net.BCrypt.HashPassword(newRefreshToken);
            user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(7);
            user.RefreshTokenRevokedAt = null;

            // ✅ Async save
            await _context.SaveChangesAsync();

            SetRefreshTokenCookie(newRefreshToken);

            return Ok(new { accessToken = newAccessToken });
        }

        // ─────────────────────────────────────────────────────────
        // POST /api/Auth/register
        // ─────────────────────────────────────────────────────────
        [HttpPost("register")]
        [EnableRateLimiting("AuthLimiter")]   // ✅ Added rate limiting
        public async Task<IActionResult> Register([FromBody] RegisterDTO userDTO)
        {
            // ✅ Validate model
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // ✅ Check duplicate email
            var existingUser = _context.Users
                .FirstOrDefault(u => u.Email == userDTO.Email);

            if (existingUser != null)
                return Conflict("Email already registered");

            var newUser = new User
            {
                UserName = userDTO.UserName,
                Email = userDTO.Email,
                Role = "Teller",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDTO.Password)
            };

            var savedUser = await _userRepository.AddUsersAsync(newUser);

            // ✅ Never return sensitive fields
            return Ok(new
            {
                savedUser.Id,
                savedUser.UserName,
                savedUser.Email,
                savedUser.Role,
            });
        }

        // ─────────────────────────────────────────────────────────
        // POST /api/Auth/logout
        // ─────────────────────────────────────────────────────────
        [HttpPost("logout")]
        [Authorize]   // ✅ Must be logged in to logout
        public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
        {
            var user = await _userRepository
                .GetUserByRefreshTokenAsync(request.Email);

            if (user != null)
            {
                await _userRepository.RevokeRefreshTokenAsync(user);
                await _context.SaveChangesAsync();
            }

            // ✅ Delete cookie with same options it was set with
            Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Path = "/api/Auth",
            });

            return Ok("Logged out successfully");
        }
    }
}