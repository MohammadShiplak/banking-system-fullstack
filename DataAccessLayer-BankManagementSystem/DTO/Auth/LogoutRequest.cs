namespace Back_End_Bank_Management_System.Auth
{
    public class LogoutRequest
    {
        public string RefreshToken { get; set; }
        public string Email { get; set; }   
    }
}
