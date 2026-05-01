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

namespace Back_End_Bank_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AuthController : ControllerBase
    {
        private readonly IUserRepository<User> _userRepository;

        private readonly ApplicationDbContext _context;



        public AuthController(IUserRepository<User>userRepository,ApplicationDbContext context)
        {

            _userRepository = userRepository;

            _context = context; 
        }

        private static string GenerateRefreshToken()
        {
            var bytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }



     
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(s => s.Email == request.Email);

            if (user == null)
                return Unauthorized("Invalid credentials");

            bool isValidPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!isValidPassword)
                return Unauthorized("Invalid credentials");

            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email,          user.Email),
        new Claim(ClaimTypes.Role,           user.Role)
    };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("THIS_IS_A_VERY_SECRET_KEY_123456"));

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

            // ✅ Verify both fields saved correctly
            Console.WriteLine($"RefreshToken:     {user.RefreshToken}");
            Console.WriteLine($"RefreshTokenHash: {user.RefreshTokenHash}");
            Console.WriteLine($"ExpiresAt:        {user.RefreshTokenExpiresAt}");

            return Ok(new TokenResponse
            {
                AccessToken = accessToken,
                RefreshToken = rawRefreshToken  // ← send RAW to frontend
            });
        }


        [HttpPost("refresh")]
        public IActionResult Refresh([FromBody] RefreshRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

            if (user == null)
                return BadRequest("Invalid refresh request");

            if (user.RefreshTokenRevokedAt != null)
                return Unauthorized("Refresh token was revoked, please login again");

            if (user.RefreshTokenExpiresAt == null ||
                user.RefreshTokenExpiresAt <= DateTime.UtcNow)
                return Unauthorized("Refresh token expired, please login again");

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
                Encoding.UTF8.GetBytes("THIS_IS_A_VERY_SECRET_KEY_123456"));

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

            return Ok(new TokenResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            });
        }










    }
}
