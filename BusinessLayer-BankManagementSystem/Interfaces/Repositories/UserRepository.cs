
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
            return _Context.Users.FirstOrDefaultAsync(u => u.Email == username && u.PasswordHash == hashedPassword);
        }

        public Task<User> GetUserByEmailAsync(string email)
        {
            return _Context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public Task<User> GetUserByRefreshTokenAsync(string email)
        {
           return _Context.Users.FirstOrDefaultAsync(u => u.Email== email);    
        }

        public Task SaveRefreshTokenAsync(User user, string refreshTokenHash, DateTime expiresAt)
        {
            // store the HASH of the refresh token, not the raw token itself
            user.RefreshTokenHash = refreshTokenHash;
            user.RefreshTokenExpiresAt = expiresAt;
            user.RefreshTokenRevokedAt = null; // reset revoked time when issuing new token

          ;
            return _Context.SaveChangesAsync(); 
        }

        public async Task RevokeRefreshTokenAsync(User user)
        {
            user.RefreshTokenRevokedAt = DateTime.UtcNow;
            await _Context.SaveChangesAsync();  
        }
    }
}
