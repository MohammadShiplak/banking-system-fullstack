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
    }
}
