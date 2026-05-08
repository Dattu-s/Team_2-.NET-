using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyAPI.Data;
using PharmacyAPI.DTOs;
using PharmacyAPI.Interfaces;
using PharmacyAPI.Models;

namespace PharmacyAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class PrescriptionsController(PharmacyDbContext context, IWebHostEnvironment env, IEmailService emailService) : ControllerBase
{
    [HttpPost("upload")]
    public async Task<ActionResult<PrescriptionDto>> Upload([FromForm] int userId, IFormFile file)
    {
        if (file.Length == 0) return BadRequest(new { message = "Prescription file is required." });

        var uploadDir = Path.Combine(env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot"), "uploads");
        Directory.CreateDirectory(uploadDir);
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var absolutePath = Path.Combine(uploadDir, fileName);
        await using (var stream = System.IO.File.Create(absolutePath))
        {
            await file.CopyToAsync(stream);
        }

        var prescription = new Prescription { UserId = userId, FilePath = $"/uploads/{fileName}", Status = "Pending" };
        context.Prescriptions.Add(prescription);
        await context.SaveChangesAsync();
        return Ok(ToDto(prescription));
    }

    [HttpGet("user/{userId:int}")]
    public async Task<IEnumerable<PrescriptionDto>> GetByUser(int userId) =>
        await context.Prescriptions.AsNoTracking().Where(x => x.UserId == userId).OrderByDescending(x => x.UploadedDate).Select(x => ToDto(x)).ToListAsync();

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IEnumerable<PrescriptionDto>> GetAll() =>
        await context.Prescriptions.AsNoTracking().OrderByDescending(x => x.UploadedDate).Select(x => ToDto(x)).ToListAsync();

    [Authorize(Roles = "Admin")]
    [HttpPut("approve/{id:int}")]
    public async Task<IActionResult> Approve(int id, UpdatePrescriptionStatusDto dto)
    {
        var prescription = await context.Prescriptions.Include(x => x.User).FirstOrDefaultAsync(x => x.PrescriptionId == id);
        if (prescription is null) return NotFound();
        prescription.Status = dto.Status;
        await context.SaveChangesAsync();
        if (prescription.User is not null)
        {
            await emailService.SendAsync(prescription.User.UserEmail, "Prescription status updated", $"Your prescription #{id} is {dto.Status}.");
        }
        return NoContent();
    }

    private static PrescriptionDto ToDto(Prescription x) => new(x.PrescriptionId, x.UserId, x.FilePath, x.Status, x.UploadedDate);
}
