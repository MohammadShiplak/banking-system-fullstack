
using Back_End_Bank_Management_System.Authorization;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


// This authorization handler enforces the ownership rule for student resources.
// It checks whether the current user is either:
// - An Admin (full access), OR
// - The owner of the student record being requested
public class StudentOwnerOrAdminHandler : AuthorizationHandler<StudentOwnerOrAdminRequirement, int>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, StudentOwnerOrAdminRequirement requirement, int Id)
    {
    
        //admin 
        if(context.User.IsInRole("Admin"))
        {

            context.Succeed(requirement);   
            return Task.CompletedTask;  

        }

        //ownership check 
        var userId=context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if(int.TryParse(userId , out int authenticatedId)&& authenticatedId == Id)
        {
            context.Succeed(requirement);
        }


        return Task.CompletedTask;
    }
}

