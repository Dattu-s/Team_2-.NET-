namespace PharmacyAPI.Models;

public class Prescription
{
    public int PrescriptionId { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public DateTime UploadedDate { get; set; } = DateTime.UtcNow;
}
