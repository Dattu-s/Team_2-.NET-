using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyAPI.Data;
using PharmacyAPI.DTOs;
using PharmacyAPI.Models;

namespace PharmacyAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicinesController(PharmacyDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<MedicineDto>> Get([FromQuery] string? search, [FromQuery] int? categoryId)
    {
        var query = context.Medicines.Include(x => x.Category).AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x => x.MedicineName.Contains(search) || (x.MedicineDescription != null && x.MedicineDescription.Contains(search)));
        }
        if (categoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == categoryId);
        }
        return await query.OrderBy(x => x.MedicineName).Select(x => ToDto(x)).ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<MedicineDto>> GetById(int id)
    {
        var medicine = await context.Medicines.Include(x => x.Category).AsNoTracking().FirstOrDefaultAsync(x => x.MedicineId == id);
        return medicine is null ? NotFound() : Ok(ToDto(medicine));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<MedicineDto>> Create(UpsertMedicineDto dto)
    {
        var medicine = new Medicine();
        Apply(dto, medicine);
        context.Medicines.Add(medicine);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = medicine.MedicineId }, ToDto(medicine));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpsertMedicineDto dto)
    {
        var medicine = await context.Medicines.FindAsync(id);
        if (medicine is null) return NotFound();
        Apply(dto, medicine);
        await context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var medicine = await context.Medicines.FindAsync(id);
        if (medicine is null) return NotFound();
        context.Medicines.Remove(medicine);
        await context.SaveChangesAsync();
        return NoContent();
    }

    private static MedicineDto ToDto(Medicine x) => new(x.MedicineId, x.MedicineName, x.MedicineDescription, x.MedicineDosage, x.MedicinePrice, x.MedicineStock, x.MedicineRequiresPrescription, x.MedicineImage, x.CategoryId, x.Category?.CategoryName);
    private static void Apply(UpsertMedicineDto dto, Medicine medicine)
    {
        medicine.MedicineName = dto.MedicineName;
        medicine.MedicineDescription = dto.MedicineDescription;
        medicine.MedicineDosage = dto.MedicineDosage;
        medicine.MedicinePrice = dto.MedicinePrice;
        medicine.MedicineStock = dto.MedicineStock;
        medicine.MedicineRequiresPrescription = dto.MedicineRequiresPrescription;
        medicine.MedicineImage = dto.MedicineImage;
        medicine.CategoryId = dto.CategoryId;
    }
}
