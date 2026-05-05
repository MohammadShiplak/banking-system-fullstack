using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DataAccessLayer_BankManagementSystem.Migrations
{
    /// <inheritdoc />
    public partial class ImplementRefreshToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Clients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    AccountNumber = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    AccountBalance = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0.00m),
                    Phone = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "User"),
                    RefreshToken = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    RefreshTokenHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    RefreshTokenExpiresAt = table.Column<DateTime>(type: "datetime2", maxLength: 255, nullable: true),
                    RefreshTokenRevokedAt = table.Column<DateTime>(type: "datetime2", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Clients",
                columns: new[] { "Id", "AccountBalance", "AccountNumber", "ClientName", "Phone" },
                values: new object[,]
                {
                    { 1, 1500.50m, "ACC10001", "John Smith", "555-0101" },
                    { 2, 2500.75m, "ACC10002", "Emily Johnson", "555-0102" },
                    { 3, 3200.00m, "ACC10003", "Michael Brown", "555-0103" },
                    { 4, 500.25m, "ACC10004", "Sarah Davis", "555-0104" },
                    { 5, 7500.00m, "ACC10005", "David Wilson", "555-0105" },
                    { 6, 1200.00m, "ACC10006", "Jennifer Martinez", "555-0106" },
                    { 7, 450.50m, "ACC10007", "Robert Taylor", "555-0107" },
                    { 8, 6800.25m, "ACC10008", "Lisa Anderson", "555-0108" },
                    { 9, 950.00m, "ACC10009", "Thomas Thomas", "555-0109" },
                    { 10, 3500.75m, "ACC10010", "Amanda Garcia", "555-0110" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "PasswordHash", "RefreshToken", "RefreshTokenExpiresAt", "RefreshTokenHash", "RefreshTokenRevokedAt", "Role", "UserName" },
                values: new object[,]
                {
                    { 1, "Mohammadshiplak@gmail.com", "$2a$11$h8pAqCpqQKjF1GK9QKKvR.e7iZPmNkRdFLLNz7FGC0l7KTSZFvxrq", null, null, null, null, "Admin", "Mohammad_Shiplak" },
                    { 2, "jane@example.com", "$2a$11$h8pAqCpqQKjF1GK9QKKvR.e7iZPmNkRdFLLNz7FGC0l7KTSZFvxrq", null, null, null, null, "Teller", "jane_smith" },
                    { 3, "mike@example.com", "$2a$11$h8pAqCpqQKjF1GK9QKKvR.e7iZPmNkRdFLLNz7FGC0l7KTSZFvxrq", null, null, null, null, "Client", "mike_jones" },
                    { 4, "sara@example.com", "$2a$11$h8pAqCpqQKjF1GK9QKKvR.e7iZPmNkRdFLLNz7FGC0l7KTSZFvxrq", null, null, null, null, "Client", "sara_wilson" },
                    { 5, "david@example.com", "$2a$11$h8pAqCpqQKjF1GK9QKKvR.e7iZPmNkRdFLLNz7FGC0l7KTSZFvxrq", null, null, null, null, "Client", "david_brown" },
                    { 6, "emily@example.com", "$2a$11$h8pAqCpqQKjF1GK9QKKvR.e7iZPmNkRdFLLNz7FGC0l7KTSZFvxrq", null, null, null, null, "Teller", "emily_davis" },
                    { 7, "robert@example.com", "$2a$11$h8pAqCpqQKjF1GK9QKKvR.e7iZPmNkRdFLLNz7FGC0l7KTSZFvxrq", null, null, null, null, "Client", "robert_taylor" },
                    { 8, "lisa@example.com", "$2a$11$h8pAqCpqQKjF1GK9QKKvR.e7iZPmNkRdFLLNz7FGC0l7KTSZFvxrq", null, null, null, null, "Client", "lisa_miller" },
                    { 9, "thomas@example.com", "$2a$11$h8pAqCpqQKjF1GK9QKKvR.e7iZPmNkRdFLLNz7FGC0l7KTSZFvxrq", null, null, null, null, "Client", "thomas_wilson" },
                    { 10, "amy@example.com", "$2a$11$h8pAqCpqQKjF1GK9QKKvR.e7iZPmNkRdFLLNz7FGC0l7KTSZFvxrq", null, null, null, null, "Client", "amy_jackson" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clients_AccountNumber",
                table: "Clients",
                column: "AccountNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Clients");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
