namespace DataAccessLayer_BankManagementSystem.Entities
{
    public class Client
    {

        public int Id { get; set; }

        public string ?ClientName { get; set; }

        public string ?AccountNumber { get; set; }

        public decimal AccountBalance { get; set; }

        public string ?Phone {  get; set; } 



    }
}
