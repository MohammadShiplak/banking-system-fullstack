
using DataAccessLayer_BankManagementSystem.Data;
using DataAccessLayer_BankManagementSystem.Entities;
using DataAccessLayer_BankManagementSystem.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BusinessLayer_BankManagementSystem.Services
{
    public class UserRepository<T> : IUserRepository<T> where T : class
    {

    protected ApplicationDbContext _Context { get; set; }

        public UserRepository(ApplicationDbContext context)
        {
            _Context = context; 
        }

        public async Task <IEnumerable<T>> GetAllUsersAsync()
        {
            return await _Context.Set<T>().ToListAsync();
        }

        public async Task <T> GetByUsersinfobyIdAsync(int id)
        {
            return await _Context.Set<T>().FindAsync(id);
        }

        public async Task  <T> AddUsersAsync(T entity)
        {
          await  _Context.Set<T>().AddAsync(entity);
           await _Context.SaveChangesAsync();
            return entity;
        }

        public async Task <T> UpdateUsersAsync(T entity)
        {
            _Context.Set<T>().Update(entity);
          await  _Context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteUserAsync(T entity)
        {
            _Context.Set<T>().Remove(entity);
          await  _Context.SaveChangesAsync();
           
        }

        public Task<User> FindUsersbyUserNameAndPasswordAsync(string username, string hashedPassword)
        {
            return _Context.Users.FirstOrDefaultAsync(u => u.UserName == username && u.Password == hashedPassword);
        }
    }
}
