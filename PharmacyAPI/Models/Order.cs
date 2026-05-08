namespace PharmacyAPI.Models;

public class Order
{
    public int OrderId { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public int? PrescriptionId { get; set; }
    public Prescription? Prescription { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public ICollection<OrderItem> OrderItems { get; set; } = [];
}
