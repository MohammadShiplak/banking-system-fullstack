using DataAccessLayer_BankManagementSystem.DTO;
using DataAccessLayer_BankManagementSystem.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer_BankManagementSystem.Data
{
    public  class ApplicationDbContext:DbContext
    {

        public DbSet<User> Users { get; set; } 

        public DbSet<Client> Clients { get; set; } 


        public ApplicationDbContext (DbContextOptions<ApplicationDbContext> options):base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<ClientCountResult>().HasNoKey();
            modelBuilder.Entity<TransferRequest>().HasNoKey();
            modelBuilder.Entity<LoginRequest>().HasNoKey();
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        }





        /*
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            var Config = new ConfigurationBuilder().AddJsonFile("appsettings.json")
                                                   .Build();

            var ConnectionString = Config.GetSection("Constr").Value;


            optionsBuilder.UseSqlServer(ConnectionString);



        }
        */



    }

   
}
