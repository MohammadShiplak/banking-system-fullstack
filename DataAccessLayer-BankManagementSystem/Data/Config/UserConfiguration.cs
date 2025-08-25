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
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            // Primary Key
            builder.HasKey(c => c.Id);

            // Required Fields (remove '?' from properties if needed)
            builder.Property(c => c.UserName)
                  .IsRequired()
                  .HasMaxLength(100);

            builder.Property(c => c.Password)
                  .IsRequired()
                  .HasMaxLength(150);

            builder.Property(c => c.Email)
                .IsRequired()
                  .HasMaxLength(150);

            // Default value for AccountBalance
          

            builder.ToTable("Users");

            builder.HasData(LoadUsers());
     
          


        }

        private static List<User> LoadUsers()
        {
            return new List<User>
    {
        new User { Id = 1, UserName = "john_doe", Password = "pass123", Email = "john@example.com" },
        new User { Id = 2, UserName = "jane_smith", Password = "jane456", Email = "jane@example.com" },
        new User { Id = 3, UserName = "mike_jones", Password = "mike789", Email = "mike@example.com" },
        new User { Id = 4, UserName = "sara_wilson", Password = "sara012", Email = "sara@example.com" },
        new User { Id = 5, UserName = "david_brown", Password = "david345", Email = "david@example.com" },
        new User { Id = 6, UserName = "emily_davis", Password = "emily678", Email = "emily@example.com" },
        new User { Id = 7, UserName = "robert_taylor", Password = "robert901", Email = "robert@example.com" },
        new User { Id = 8, UserName = "lisa_miller", Password = "lisa234", Email = "lisa@example.com" },
        new User { Id = 9, UserName = "thomas_wilson", Password = "thomas567", Email = "thomas@example.com" },
        new User { Id = 10, UserName = "amy_jackson", Password = "amy890", Email = "amy@example.com" }
    };
        }

    }
}
