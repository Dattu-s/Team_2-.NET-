using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyAPI.Data;

namespace PharmacyAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WellnessController(PharmacyDbContext context) : ControllerBase
{
    [HttpGet("packages")]
    public async Task<IActionResult> Packages() => Ok(await context.HealthPackages.AsNoTracking().ToListAsync());

    [Authorize]
    [HttpGet("loyalty/{userId:int}")]
    public async Task<IActionResult> Loyalty(int userId) => Ok(await context.LoyaltyPoints.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == userId));
}
