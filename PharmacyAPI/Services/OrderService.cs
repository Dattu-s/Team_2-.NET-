using Microsoft.EntityFrameworkCore;
using PharmacyAPI.Data;
using PharmacyAPI.DTOs;
using PharmacyAPI.Interfaces;
using PharmacyAPI.Models;

namespace PharmacyAPI.Services;

public class OrderService(PharmacyDbContext context, IEmailService emailService) : IOrderService
{
    public async Task<OrderDto> PlaceOrderAsync(PlaceOrderDto dto)
    {
        var cartItems = await context.Cart.Include(x => x.Medicine).Where(x => x.UserId == dto.UserId).ToListAsync();
        if (cartItems.Count == 0)
        {
            throw new InvalidOperationException("Cart is empty.");
        }

        var hasPrescriptionMedicine = cartItems.Any(x => x.Medicine!.MedicineRequiresPrescription);
        if (hasPrescriptionMedicine)
        {
            var approved = dto.PrescriptionId.HasValue && await context.Prescriptions.AnyAsync(x =>
                x.PrescriptionId == dto.PrescriptionId && x.UserId == dto.UserId && x.Status == "Approved");
            if (!approved)
            {
                throw new InvalidOperationException("Approved prescription is required before ordering prescription medicines.");
            }
        }

        foreach (var item in cartItems)
        {
            if (item.Medicine!.MedicineStock < item.Quantity)
            {
                throw new InvalidOperationException($"{item.Medicine.MedicineName} does not have enough stock.");
            }
        }

        var order = new Order
        {
            UserId = dto.UserId,
            PrescriptionId = dto.PrescriptionId,
            TotalAmount = cartItems.Sum(x => x.Quantity * x.Medicine!.MedicinePrice),
            Status = "Pending",
            OrderItems = cartItems.Select(x => new OrderItem
            {
                MedicineId = x.MedicineId,
                Quantity = x.Quantity,
                Price = x.Medicine!.MedicinePrice
            }).ToList()
        };

        context.Orders.Add(order);
        context.Cart.RemoveRange(cartItems);
        await context.SaveChangesAsync();

        var user = await context.Users.FindAsync(dto.UserId);
        if (user is not null)
        {
            await emailService.SendAsync(user.UserEmail, "Pharmacy order placed", $"Your order #{order.OrderId} was placed successfully.");
        }

        return (await GetOrderAsync(order.OrderId))!;
    }

    public async Task<List<OrderDto>> GetUserOrdersAsync(int userId) =>
        await QueryOrders().Where(x => x.UserId == userId).Select(x => ToDto(x)).ToListAsync();

    public async Task<List<OrderDto>> GetAllOrdersAsync() =>
        await QueryOrders().Select(x => ToDto(x)).ToListAsync();

    public async Task<OrderDto?> UpdateStatusAsync(int orderId, string status)
    {
        var order = await context.Orders.Include(x => x.OrderItems).ThenInclude(x => x.Medicine).FirstOrDefaultAsync(x => x.OrderId == orderId);
        if (order is null)
        {
            return null;
        }

        if (status == "Confirmed" && order.Status != "Confirmed")
        {
            foreach (var item in order.OrderItems)
            {
                item.Medicine!.MedicineStock -= item.Quantity;
            }
        }

        order.Status = status;
        await context.SaveChangesAsync();
        return await GetOrderAsync(orderId);
    }

    private Task<OrderDto?> GetOrderAsync(int orderId) => QueryOrders().Where(x => x.OrderId == orderId).Select(x => ToDto(x)).FirstOrDefaultAsync();

    private IQueryable<Order> QueryOrders() => context.Orders
        .AsNoTracking()
        .Include(x => x.OrderItems)
        .ThenInclude(x => x.Medicine)
        .OrderByDescending(x => x.CreatedDate);

    private static OrderDto ToDto(Order order) => new(
        order.OrderId,
        order.UserId,
        order.PrescriptionId,
        order.TotalAmount,
        order.Status,
        order.CreatedDate,
        order.OrderItems.Select(i => new OrderItemDto(i.OrderItemId, i.MedicineId, i.Medicine?.MedicineName, i.Quantity, i.Price)));
}
