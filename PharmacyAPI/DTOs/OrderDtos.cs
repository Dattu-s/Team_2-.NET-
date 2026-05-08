namespace PharmacyAPI.DTOs;

public record OrderItemDto(int OrderItemId, int MedicineId, string? MedicineName, int Quantity, decimal Price);
public record OrderDto(int OrderId, int UserId, int? PrescriptionId, decimal TotalAmount, string Status, DateTime CreatedDate, IEnumerable<OrderItemDto> Items);
public record PlaceOrderDto(int UserId, int? PrescriptionId);
public record UpdateOrderStatusDto(string Status);
