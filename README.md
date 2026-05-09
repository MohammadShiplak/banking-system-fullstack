🏦 Bank Management System

A modern full-stack Bank Management System built with React.js and ASP.NET Core Web API that allows users to perform secure banking operations such as deposits, withdrawals, transfers, and transaction tracking.

The system follows clean architecture principles and includes advanced security features such as Authentication & Authorization, Ownership Policies, HTTPS Encryption, Rate Limiting, and Logging & Auditing.

🚀 Features
🔐 Authentication & Security
Secure Login System
JWT Authentication
Role-Based Authorization
Ownership Policies (Users can only access their own resources)
HTTPS Encryption
CORS Protection
Rate Limiting
Logging & Auditing System
Secure Password Hashing
💳 Banking Operations
Deposit Money
Withdraw Money
Transfer Funds Between Accounts
View Transaction History
Real-Time Balance Updates
👥 Management Dashboard
User Management
Client Management
CRUD Operations
Responsive Admin Dashboard
🎨 Frontend Features
Fully Responsive UI
Modern User Experience
State Management with Redux Toolkit
Protected Routes
API Integration with Axios
🧰 Tech Stack
🌐 Frontend
React.js
TypeScript
Redux Toolkit
React Router
Axios
React Bootstrap
🖥️ Backend
C#
ASP.NET Core Web API
Entity Framework Core
SQL Server
Repository Pattern
3-Tier Architecture
Architecture Layers
Presentation Layer
Business Layer
Data Access Layer
🛡️ Security Features
Feature	Description
Authentication	Secure JWT-based authentication
Authorization	Role-based access control
Ownership Policies	Prevents unauthorized access to other users' data
HTTPS	Encrypts communication between client and server
CORS Protection	Restricts unauthorized cross-origin requests
Rate Limiting	Protects APIs from abuse and excessive requests
Logging & Auditing	Tracks important actions and system events
Password Hashing	Stores passwords securely using hashing
📂 Project Structure
BankManagementSystem/
│
├── Frontend/                 # React Frontend
│
├── Backend/
│   ├── Presentation Layer
│   ├── Business Layer
│   └── Data Access Layer
│
└── Database/                 # SQL Server Database
⚙️ Installation & Setup
🔧 Backend Setup
1️⃣ Clone the Repository
git clone <your-repository-url>
2️⃣ Navigate to Backend
cd Backend
3️⃣ Configure Database Connection

Update your appsettings.json:

"ConnectionStrings": {
  "DefaultConnection": "Your_SQL_Server_Connection_String"
}
4️⃣ Apply Migrations
dotnet ef database update
5️⃣ Run the API
dotnet run
🌐 Frontend Setup
1️⃣ Navigate to Frontend
cd Frontend
2️⃣ Install Dependencies
npm install
3️⃣ Run the Application
npm run dev

### 📽️ Demo Video

[Click here to watch the demo](https://youtu.be/guJff7Y3QII)

