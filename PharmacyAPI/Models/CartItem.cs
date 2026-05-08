namespace PharmacyAPI.Models;

public class CartItem
{
    public int CartId { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public int MedicineId { get; set; }
    public Medicine? Medicine { get; set; }
    public int Quantity { get; set; }
    public DateTime AddedDate { get; set; } = DateTime.UtcNow;
}
