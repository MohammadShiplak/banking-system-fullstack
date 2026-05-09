using BusinessLayer_BankManagementSystem.Services;
using DataAccessLayer_BankManagementSystem.Data;
using DataAccessLayer_BankManagementSystem.DTO;
using DataAccessLayer_BankManagementSystem.Entities;
using DataAccessLayer_BankManagementSystem.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Back_End_Bank_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    // [Authorize] on the class = ALL endpoints require login
    // No one can access anything here without a valid JWT token

    public class ClientController : ControllerBase
    {
       private  readonly IClientRepository<Client> _clientRepository;

       private readonly ApplicationDbContext _context;

        private readonly ILogger<ClientController> _logger;   


        public ClientController(IClientRepository<Client> clientRepository, ApplicationDbContext context, ILogger<ClientController> logger)
        {
            _clientRepository = clientRepository;
            _context = context;
            _logger = logger;   
        }


        [HttpGet]
        [Authorize(Roles ="Admin,Teller")]

        // Only Admin and Teller can see ALL clients
        // Client cannot see other clients — only their own account
        public async Task < IActionResult> Get()
        {
            var clients =await  _clientRepository.GetAllClientsAsync();

            return Ok(clients);
        }

        [HttpGet("GetAllClientCount")]
        [Authorize(Roles ="Admin,Teller")]
        public async Task<IActionResult> GetAllClientCount()
        {

            var count = await _context.Clients.CountAsync();

            return Ok(new { totalClients = count });


        }
        [HttpGet("account/{accountNumber}")]
        public async Task<IActionResult> GetClient(string accountNumber)
        {
            try
            {
                var client = await _clientRepository.FindByAccountNumberAsync(accountNumber);
                if (client == null)
                    return NotFound();

                return Ok(client);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("{accountNumber}/deposit")]
        [Authorize(Roles = "Admin,Teller,Client")]
        public async Task<IActionResult> Deposit(string accountNumber, [FromBody] DepositRequest request)
        {
            try
            {
                var newBalance = await _clientRepository.DepositAsync(accountNumber, request.Amount);
                return Ok(new { balance = newBalance });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("{accountNumber}/withdrew")]
        [Authorize(Roles = "Admin,Teller,Client")]
        public async Task<IActionResult> Withdrew(string accountNumber, [FromBody] DepositRequest request)
        {
            try
            {
                var newBalance = await _clientRepository.WithdrewAsync(accountNumber, request.Amount);
                return Ok(new { balance = newBalance });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("Transfer")]
        [Authorize(Roles = "Admin,Teller,Client")]
        public async Task<IActionResult> Transfer([FromBody] TransferRequest request)
        {
            try
            {

                var result = await _clientRepository.TransferAsync(

                              request.FromAccount,
                              request.ToAccount,
                              request.Amount

                              );


                return Ok(result);


            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message); // 400 Bad Request (e.g., invalid amount)
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message); // 400 Bad Request (e.g., insufficient funds)
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An internal error occurred."); // 500 Server Error
            }



        }

        [HttpGet("GetTotallAccountBalance")]
        [Authorize(Roles = "Admin,Teller")]
        public async Task<IActionResult> GetTotallAccountBalance()
{
  
    var totalBalance = await _context.Clients.SumAsync(a => a.AccountBalance);
    
    return Ok(new { 
        totalBalance = totalBalance
    });
}






        [HttpGet("{Id}")]
        [Authorize(Roles = "Admin,Teller,Client")]
        public async Task <IActionResult> Get(int Id, [FromServices] IAuthorizationService authorizationService)
        {
            var client = await _clientRepository.GetByClientsinfoByIdAsync(Id);
            if (client == null) return NotFound();

            var authResult = await authorizationService.AuthorizeAsync(User, Id, "StudentOwnerOrAdmin"); 

            if(!authResult.Succeeded)
                return Forbid(); // 403 Forbidden if user is not authorized to access this client



            return Ok(client);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles ="Admin")]
        public async Task <IActionResult> Delete(int id)
        {
            // ✅ Capture IP once for tracing (helps investigations later)
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            // ✅ Identify the admin who is performing the action
            // ClaimTypes.NameIdentifier is what you put in JWT during login.
            var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "unknown";

            // ===============================
            // Validation: invalid ID
            // ===============================

            if(id<0)
            {

              _logger.LogWarning("Admin action blocked (invalid Id). AdminId={AdminId},Action=Delete,TargetId={TargetId},IP={IP}", adminId, id, ip);



                return BadRequest($"Not accepted ID {id}");
            }






            var client =await  _context.Clients.FindAsync(id);

            if (client == null)
            {
                // ✅ Audit: admin attempted to delete a non-existing student
                _logger.LogWarning(
                    "Admin action failed (target not found). AdminId={AdminId}, Action=DeleteStudent, TargetId={TargetId}, IP={IP}",
                    adminId,
                    id,
                    ip
                );

                return NotFound($"client with ID {id} not found.");
            }

            // ✅ Why before?
            // If delete throws or fails later, you still have the audit record of the attempt.
            _logger.LogInformation(
      "Admin action started. AdminId={AdminId}, Action=DeleteStudent, TargetId={TargetId}, IP={IP}",
      adminId,
      client.Id,

      ip
  );

            // Delete the product
            await _clientRepository.DeleteClientAsync(client);

            _logger.LogInformation(
       "Admin action succeeded. AdminId={AdminId}, Action=DeleteStudent, TargetId={TargetId}, IP={IP}",
       adminId,
       id,
       ip
   );



            // Return 200 OK with the deleted product in the response body
            return Ok(client);

        }

        [HttpPut]
        [Authorize(Roles = "Admin,Teller")]
        public async Task <IActionResult> Update(Client client)
        {


            var updatedClients =await _clientRepository.UpdateClientsAsync(client);

            return Ok(updatedClients);

        }
        [HttpPost]
        [Authorize(Roles = "Admin,Teller")]
        public async Task<IActionResult> Add(Client client)
        {

            var users = await _clientRepository.AddClientsAsync(client);

            return Ok(users);
        }
    }


    }

