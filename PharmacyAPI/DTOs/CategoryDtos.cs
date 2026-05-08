namespace PharmacyAPI.DTOs;

public record CategoryDto(int CategoryId, string CategoryName, string? Description);
public record UpsertCategoryDto(string CategoryName, string? Description);
