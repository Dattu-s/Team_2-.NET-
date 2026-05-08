namespace PharmacyAPI.Models;

public class HealthPackage
{
    public int PackageId { get; set; }
    public string PackageName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Description { get; set; }
}
