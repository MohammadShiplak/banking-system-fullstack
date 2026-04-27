using DataAccessLayer_BankManagementSystem.Data;
using DataAccessLayer_BankManagementSystem.DTO;
using DataAccessLayer_BankManagementSystem.Entities;
using DataAccessLayer_BankManagementSystem.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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



        // This endpoint handles user login.
        // It verifies credentials and returns a JWT token if login succeeds.
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Step 1: Find the user by email from the database.
            // Email acts as the unique login identifier
            var user = await _userRepository.GetUserByEmailAsync(request.Email);


            // If no user is found with the given email,
            // return 401 Unauthorized without revealing which field was wrong.
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid Credentials" });
            }
            // Step 2: Verify the provided password against the stored hash.
            // BCrypt handles hashing and salt internally.

            bool isValidPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            // If the password does not match the stored hash,
            // return 401 Unauthorized.

            if (!isValidPassword)
                return Unauthorized("Invalid credentials");

            // Step 3: Create claims that represent the authenticated user's identity.
            // These claims will be embedded inside the JWT.

            var claims = new[]
            {

                 // Unique identifier for the user
                 new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),

                 // User email address
                 new Claim(ClaimTypes.Email, user.Email),    

                 // Role (Teller or Admin or Client) used later for authorization
                 new Claim(ClaimTypes.Role, user.Role)

            };

            // Step 4: Create the symmetric security key used to sign the JWT.
            // This key must match the key used in JWT validation middleware.


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("THIS_IS_A_VERY_SECRET_KEY_123456"));

            // Step 5: Define the signing credentials.
            // This specifies the algorithm used to sign the token.

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);


            // Step 6: Create the JWT token.
            // The token includes issuer, audience, claims, expiration, and signature.

            var token = new JwtSecurityToken(

                issuer: "BankAPI",
                audience: "BankAPIManagementSystem",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds

                );

            // Step 7: Return the serialized JWT token to the client.
            // The client will send this token with future requests.




            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token)

            });


        }



















    }
}
