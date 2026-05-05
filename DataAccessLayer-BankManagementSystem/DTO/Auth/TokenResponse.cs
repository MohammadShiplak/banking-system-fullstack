namespace Back_End_Bank_Management_System.Auth
{ // This is what we send BACK to the frontend after login
    // Contains both tokens
    public class TokenResponse
    {
        public string AccessToken { get; set; }

        public string RefreshToken { get; set; }    
    }
}
