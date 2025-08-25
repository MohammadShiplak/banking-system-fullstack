using DataAccessLayer_BankManagementSystem.DTO;
using DataAccessLayer_BankManagementSystem.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer_BankManagementSystem.Interfaces
{
    public interface IClientRepository<T> where T : class
    {

        Task<IEnumerable<T>> GetAllClientsAsync();
        Task<T> GetByClientsinfoByIdAsync(int id);
        Task<T> AddClientsAsync(T entity);

        Task<Client> UpdateClientsAsync(Client entity);
        Task DeleteClientAsync(T entity);
        Task<int> GetAllClientCountsAsync();

        Task<Client> FindByAccountNumberAsync(string accountNumber);

        Task<decimal> DepositAsync(string accountNumber, decimal amount);

        Task<decimal> WithdrewAsync(string accountNumber, decimal amount);

         Task<TransferRequest> TransferAsync(string fromAccountNumber, string toAccountNumber, decimal amount);

    
    }
}
