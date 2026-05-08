namespace PharmacyAPI.DTOs;

public record CartItemDto(int CartId, int UserId, int MedicineId, string? MedicineName, decimal Price, int Quantity, decimal LineTotal);
public record UpsertCartItemDto(int UserId, int MedicineId, int Quantity);
