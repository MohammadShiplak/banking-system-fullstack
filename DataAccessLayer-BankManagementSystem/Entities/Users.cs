using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer_BankManagementSystem.Entities
{
    public  class User
    {

        public int Id { get; set; } 

        public string ?UserName { get; set; } 

        public string ?Email { get; set; }

     
        public string? PasswordHash { get; set; }

        public string? Role { get; set; } = "User";

        public string ?RefreshToken { get; set; }


        // ✅ NEW: Store the HASH of refresh token (not the raw token)
        // Same idea as PasswordHash — never store raw sensitive values
        public string? RefreshTokenHash { get; set; }
        // ✅ NEW: When does the refresh token expire?
        // After 7 days → user must login again
        public DateTime? RefreshTokenExpiresAt { get; set; }

        public DateTime? RefreshTokenRevokedAt { get; set; } // When was the refresh token revoked (if ever)?    



    }
}
