using DataAccessLayer_BankManagementSystem.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer_BankManagementSystem.Data.Config
{
    public class ClientConfiguration : IEntityTypeConfiguration<Client>
    {
        public void Configure(EntityTypeBuilder<Client> builder)
        {
            // Primary Key
            builder.HasKey(c => c.Id);

            // Required Fields (remove '?' from properties if needed)
            builder.Property(c => c.ClientName)
                  .IsRequired()
                  .HasMaxLength(100);

            builder.Property(c => c.AccountNumber)
                  .IsRequired()
                  .HasMaxLength(150);

            builder.Property(c => c.Phone)
                  .HasMaxLength(150);

            // Default value for AccountBalance
            builder.Property(c => c.AccountBalance)
                  .HasColumnType("decimal(18,2)")
                  .HasDefaultValue(0.00m);

            // Index for AccountNumber (optional)
            builder.HasIndex(c => c.AccountNumber)
            .IsUnique();

            builder.ToTable("Clients");

            builder.HasData(LoadClients());
     
          


        }

        private static List<Client> LoadClients()
        {
            return new List<Client>
            {
                new Client { Id = 1, ClientName = "John Smith", AccountNumber = "ACC10001", AccountBalance = 1500.50m, Phone = "555-0101" },
      new Client { Id = 2, ClientName = "Emily Johnson", AccountNumber = "ACC10002", AccountBalance = 2500.75m, Phone = "555-0102" },
      new Client { Id = 3, ClientName = "Michael Brown", AccountNumber = "ACC10003", AccountBalance = 3200.00m, Phone = "555-0103" },
      new Client { Id = 4, ClientName = "Sarah Davis", AccountNumber = "ACC10004", AccountBalance = 500.25m, Phone = "555-0104" },
      new Client { Id = 5, ClientName = "David Wilson", AccountNumber = "ACC10005", AccountBalance = 7500.00m, Phone = "555-0105" },
      new Client { Id = 6, ClientName = "Jennifer Martinez", AccountNumber = "ACC10006", AccountBalance = 1200.00m, Phone = "555-0106" },
      new Client { Id = 7, ClientName = "Robert Taylor", AccountNumber = "ACC10007", AccountBalance = 450.50m, Phone = "555-0107" },
      new Client { Id = 8, ClientName = "Lisa Anderson", AccountNumber = "ACC10008", AccountBalance = 6800.25m, Phone = "555-0108" },
      new Client { Id = 9, ClientName = "Thomas Thomas", AccountNumber = "ACC10009", AccountBalance = 950.00m, Phone = "555-0109" },
      new Client { Id = 10, ClientName = "Amanda Garcia", AccountNumber = "ACC10010", AccountBalance = 3500.75m, Phone = "555-0110" }

            };
        }





    }
}
