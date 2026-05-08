namespace PharmacyAPI.Models;

public class Category
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ICollection<Medicine> Medicines { get; set; } = [];
}
