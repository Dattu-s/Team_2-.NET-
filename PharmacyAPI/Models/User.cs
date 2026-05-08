namespace PharmacyAPI.Models;

public class User
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Customer";
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public ICollection<CartItem> CartItems { get; set; } = [];
    public ICollection<Order> Orders { get; set; } = [];
    public ICollection<Prescription> Prescriptions { get; set; } = [];
}
