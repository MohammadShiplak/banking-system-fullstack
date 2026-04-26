using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Back_End_Bank_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeneraterHash : ControllerBase
    {
        // TEMPORARY — delete this after you copy the hashes
        [HttpGet("generate-hashes")]
        public IActionResult GenerateHashes()
        {
            return Ok(new
            {
                pass123 = BCrypt.Net.BCrypt.HashPassword("pass123"),
                jane456 = BCrypt.Net.BCrypt.HashPassword("jane456"),
                mike789 = BCrypt.Net.BCrypt.HashPassword("mike789"),
                sara012 = BCrypt.Net.BCrypt.HashPassword("sara012"),
                david9345 = BCrypt.Net.BCrypt.HashPassword("9david345"),
                emily678 = BCrypt.Net.BCrypt.HashPassword("emily678"),
                robert_pass = BCrypt.Net.BCrypt.HashPassword("robert@example.com"),
                lisa234 = BCrypt.Net.BCrypt.HashPassword("lisa234"),
                pass212 = BCrypt.Net.BCrypt.HashPassword("pass212"),
                amy890 = BCrypt.Net.BCrypt.HashPassword("amy890")
            });
        }
    }
}
