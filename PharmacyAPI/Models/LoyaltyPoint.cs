namespace PharmacyAPI.Models;

public class LoyaltyPoint
{
    public int LoyaltyId { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public int Points { get; set; }
}
