using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyAPI.Data;
using PharmacyAPI.DTOs;
using PharmacyAPI.Models;

namespace PharmacyAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class CartController(PharmacyDbContext context) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<CartItemDto>> AddOrUpdate(UpsertCartItemDto dto)
    {
        var item = await context.Cart.FirstOrDefaultAsync(x => x.UserId == dto.UserId && x.MedicineId == dto.MedicineId);
        if (item is null)
        {
            item = new CartItem { UserId = dto.UserId, MedicineId = dto.MedicineId, Quantity = dto.Quantity };
            context.Cart.Add(item);
        }
        else
        {
            item.Quantity = dto.Quantity;
        }
        await context.SaveChangesAsync();
        return Ok(await ProjectCartItem(item.CartId));
    }

    [HttpGet("user/{userId:int}")]
    public async Task<IEnumerable<CartItemDto>> GetByUser(int userId) =>
        await context.Cart.Include(x => x.Medicine).AsNoTracking().Where(x => x.UserId == userId).Select(x => ToDto(x)).ToListAsync();

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await context.Cart.FindAsync(id);
        if (item is null) return NotFound();
        context.Cart.Remove(item);
        await context.SaveChangesAsync();
        return NoContent();
    }

    private Task<CartItemDto?> ProjectCartItem(int id) => context.Cart.Include(x => x.Medicine).AsNoTracking().Where(x => x.CartId == id).Select(x => ToDto(x)).FirstOrDefaultAsync();
    private static CartItemDto ToDto(CartItem x) => new(x.CartId, x.UserId, x.MedicineId, x.Medicine?.MedicineName, x.Medicine?.MedicinePrice ?? 0, x.Quantity, x.Quantity * (x.Medicine?.MedicinePrice ?? 0));
}
