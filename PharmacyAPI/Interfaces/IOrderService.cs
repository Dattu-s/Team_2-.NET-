using PharmacyAPI.DTOs;

namespace PharmacyAPI.Interfaces;

public interface IOrderService
{
    Task<OrderDto> PlaceOrderAsync(PlaceOrderDto dto);
    Task<List<OrderDto>> GetUserOrdersAsync(int userId);
    Task<List<OrderDto>> GetAllOrdersAsync();
    Task<OrderDto?> UpdateStatusAsync(int orderId, string status);
}
