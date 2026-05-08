namespace PharmacyAPI.Models;

public class Medicine
{
    public int MedicineId { get; set; }
    public string MedicineName { get; set; } = string.Empty;
    public string? MedicineDescription { get; set; }
    public string MedicineDosage { get; set; } = string.Empty;
    public decimal MedicinePrice { get; set; }
    public int MedicineStock { get; set; }
    public bool MedicineRequiresPrescription { get; set; }
    public string? MedicineImage { get; set; }
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
