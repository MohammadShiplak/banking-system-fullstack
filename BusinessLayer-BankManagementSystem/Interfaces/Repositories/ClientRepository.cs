using DataAccessLayer_BankManagementSystem.Data;
using DataAccessLayer_BankManagementSystem.DTO;
using DataAccessLayer_BankManagementSystem.Entities;
using DataAccessLayer_BankManagementSystem.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer_BankManagementSystem.Services
{
    public   class ClientRepository<T> : IClientRepository<T> where T : class
    {

        public ApplicationDbContext _Context;

     

        public ClientRepository(ApplicationDbContext Context)
        {
         _Context = Context;
        }

   

        public async Task<T> AddClientsAsync(T entity)
        {
            await _Context.Set<T>().AddAsync(entity);
            await _Context.SaveChangesAsync();
            return entity;
                
        }

     

        public async Task DeleteClientAsync(T entity)
        {
            _Context.Set<T>().Remove(entity);
            await _Context.SaveChangesAsync();
        }

        public async  Task<decimal> DepositAsync(string accountNumber, decimal amount)
        {
            var client = await FindByAccountNumberAsync(accountNumber);
            if (client == null)
                throw new ArgumentException("Client not found");

            client.AccountBalance += amount;


            await UpdateClientsAsync(client);
            return client.AccountBalance;
        }

        public async Task<Client> FindByAccountNumberAsync(string accountNumber)
        {

            return await _Context.Set<Client>().FirstOrDefaultAsync(c => c.AccountNumber == accountNumber);

        }

        public async  Task<int> GetAllClientCountsAsync()
        {
            var result = _Context.Set<ClientCountResult>()
              .FromSqlRaw("EXEC dbo.GetAllClientsCount")
              .AsEnumerable()
              .FirstOrDefault();

            return result?.TotalClientCount ?? 0;

        }

        public async  Task<IEnumerable<T>> GetAllClientsAsync()
        {
            return await _Context.Set<T>().ToListAsync();
        }

        public async  Task<T> GetByClientsinfoByIdAsync(int id)
        {
            return await _Context.Set<T>().FindAsync(id);
        }

        public async  Task<TransferRequest> TransferAsync(string fromAccountNumber, string toAccountNumber, decimal amount)
        {
            if (amount <= 0)
            {
                throw new ArgumentException("Transfer amount must be positive");
            }

            var fromClient = await FindByAccountNumberAsync(fromAccountNumber);
            if (fromClient == null)
            {
                throw new InvalidOperationException("Sender account not found");
            }

            var toClient = await FindByAccountNumberAsync(toAccountNumber);
            if (toClient == null)
            {
                throw new InvalidOperationException("Receiver account not found");
            }

            if (fromClient.AccountBalance < amount)
            {
                throw new InvalidOperationException("Insufficient funds");
            }

        
            using var transaction =await _Context.Database.BeginTransactionAsync();

            try
            {
               
                fromClient.AccountBalance -= amount;
                toClient.AccountBalance += amount;
                await _Context.SaveChangesAsync();

                await transaction.CommitAsync();
            }
            catch
            {

                await transaction.RollbackAsync();
                throw;


            }

            return new TransferRequest
            {
              Message="message send Successfully :-)",
                FromAccount = fromClient.AccountNumber,
                ToAccount = toClient.AccountNumber,
                Amount = amount,

            };

         
        }

        public async  Task<Client> UpdateClientsAsync(Client entity)
        {
            _Context.Set<Client>().Update(entity);
            await _Context.SaveChangesAsync();
            return entity;
        }

        public async  Task<decimal> WithdrewAsync(string accountNumber, decimal amount)
        {
            var client = await FindByAccountNumberAsync(accountNumber);
            if (client == null)
                throw new ArgumentException("Client not found");

            client.AccountBalance -= amount;


            await UpdateClientsAsync(client);
            return client.AccountBalance;
        }
    }

}
