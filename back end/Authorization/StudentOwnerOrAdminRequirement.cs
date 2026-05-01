using Microsoft.AspNetCore.Authorization;

namespace Back_End_Bank_Management_System.Authorization
{

    // This class represents the authorization rule itself.
    // It does NOT contain logic.
    // It simply defines the requirement:

    public class StudentOwnerOrAdminRequirement : IAuthorizationRequirement
    {
    }
}
