using DataAccessLayer_BankManagementSystem.DTO;
using DataAccessLayer_BankManagementSystem.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer_BankManagementSystem.Interfaces
{
    public  interface IUserRepository<T> where T : class
    {

       Task <IEnumerable<T>> GetAllUsersAsync();
        Task<T> GetByUsersinfobyIdAsync(int id);
        Task<T> AddUsersAsync(T entity);
      
        Task<T> UpdateUsersAsync(T entity);
        Task  DeleteUserAsync(T entity);

        Task<User> FindUsersbyUserNameAndPasswordAsync(string username, string hashedPassword);
        Task<User> GetUserByEmailAsync(string email);

        // ── NEW: needed for refresh token logic ───────
        // Find user by email AND check their refresh token
        Task<User> GetUserByRefreshTokenAsync(string email);

        //Save refresh token details to the database
        
        Task SaveRefreshTokenAsync(User user,string refreshTokenHash,DateTime expiresAt);

        Task RevokeRefreshTokenAsync(User user);    

    }
}
