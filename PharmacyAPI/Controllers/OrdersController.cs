using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PharmacyAPI.DTOs;
using PharmacyAPI.Interfaces;

namespace PharmacyAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class OrdersController(IOrderService orderService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<OrderDto>> Place(PlaceOrderDto dto)
    {
        try { return Ok(await orderService.PlaceOrderAsync(dto)); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpGet("user/{userId:int}")]
    public Task<List<OrderDto>> UserOrders(int userId) => orderService.GetUserOrdersAsync(userId);

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public Task<List<OrderDto>> AllOrders() => orderService.GetAllOrdersAsync();

    [Authorize(Roles = "Admin")]
    [HttpPut("status/{id:int}")]
    public async Task<ActionResult<OrderDto>> UpdateStatus(int id, UpdateOrderStatusDto dto)
    {
        var order = await orderService.UpdateStatusAsync(id, dto.Status);
        return order is null ? NotFound() : Ok(order);
    }
}
