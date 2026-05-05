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



            builder.Property(c => c.Email)
                .IsRequired()
                  .HasMaxLength(150);

            builder.Property(c => c.PasswordHash)
                  .IsRequired()
                  .HasMaxLength(255);

            builder.Property(c => c.Role)
                  .IsRequired()
                  .HasMaxLength(50)
                  .HasDefaultValue("User");

            // Default value for AccountBalance



            builder.Property(c => c.RefreshToken)
                .IsRequired(false)
                .HasMaxLength(255);


            builder.Property(c => c.RefreshTokenHash)
                .IsRequired(false)
                .HasMaxLength(255);


            builder.Property(c => c.RefreshTokenExpiresAt)
              .IsRequired(false)
              .HasMaxLength(255);


            builder.Property(c => c.RefreshTokenRevokedAt)
              .IsRequired(false)
              .HasMaxLength(255);   






            builder.ToTable("Users");

            builder.HasData(LoadUsers());




        }

        private static List<User> LoadUsers()
        {
            // BCrypt hash of "Password123" for all seed users
            // You can generate new hashes using: BCrypt.Net.BCrypt.HashPassword("Password123")
            var hashedPassword = "$2a$11$h8pAqCpqQKjF1GK9QKKvR.e7iZPmNkRdFLLNz7FGC0l7KTSZFvxrq";

            return new List<User>
            {
                new User { Id = 1, UserName = "Mohammad_Shiplak", Email = "Mohammadshiplak@gmail.com", PasswordHash = hashedPassword, Role = "Admin", // ✅ Explicitly set to null
            // New seeded users have no refresh token yet
            // They will get one when they first login
            RefreshToken= null,
            RefreshTokenHash      = null,
            RefreshTokenExpiresAt = null,
            RefreshTokenRevokedAt = null, },// full access
                new User { Id = 2, UserName = "jane_smith"  , Email = "jane@example.com", PasswordHash = hashedPassword, Role = "Teller",// ✅ Explicitly set to null
            // New seeded users have no refresh token yet
            // They will get one when they first login
            RefreshToken= null,
            RefreshTokenHash      = null,
            RefreshTokenExpiresAt = null,
            RefreshTokenRevokedAt = null, },//can help clients but can not delete or manager users
                new User { Id = 3, UserName = "mike_jones", Email = "mike@example.com", PasswordHash = hashedPassword, Role = "Client",// ✅ Explicitly set to null
            // New seeded users have no refresh token yet
            // They will get one when they first login
            RefreshToken= null,
            RefreshTokenHash      = null,
            RefreshTokenExpiresAt = null,
            RefreshTokenRevokedAt = null, },//Only can see and manage their own account
                new User {Id = 4, UserName = "sara_wilson", Email = "sara@example.com", PasswordHash = hashedPassword, Role = "Client",RefreshToken= null, RefreshTokenHash = null, RefreshTokenExpiresAt = null, RefreshTokenRevokedAt = null},
                new User {Id = 5, UserName = "david_brown", Email = "david@example.com", PasswordHash = hashedPassword, Role = "Client",RefreshToken= null, RefreshTokenHash = null, RefreshTokenExpiresAt = null, RefreshTokenRevokedAt = null},
                new User {Id = 6, UserName = "emily_davis", Email = "emily@example.com", PasswordHash = hashedPassword, Role = "Teller",RefreshToken= null, RefreshTokenHash = null, RefreshTokenExpiresAt = null, RefreshTokenRevokedAt = null},
                new User {Id = 7, UserName = "robert_taylor", Email = "robert@example.com", PasswordHash = hashedPassword, Role = "Client",RefreshToken= null, RefreshTokenHash = null, RefreshTokenExpiresAt = null, RefreshTokenRevokedAt = null},
                new User {Id = 8, UserName = "lisa_miller", Email = "lisa@example.com", PasswordHash = hashedPassword, Role = "Client",RefreshToken= null, RefreshTokenHash = null, RefreshTokenExpiresAt = null, RefreshTokenRevokedAt = null},
                new User {Id = 9, UserName = "thomas_wilson", Email = "thomas@example.com", PasswordHash = hashedPassword, Role = "Client",RefreshToken= null, RefreshTokenHash = null, RefreshTokenExpiresAt = null, RefreshTokenRevokedAt = null},
                new User {Id = 10, UserName = "amy_jackson", Email = "amy@example.com", PasswordHash = hashedPassword, Role = "Client",RefreshToken= null, RefreshTokenHash = null, RefreshTokenExpiresAt = null, RefreshTokenRevokedAt = null}
            };
        }

    }
}
