using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PharmacyAPI.DTOs;
using PharmacyAPI.Interfaces;
using PharmacyAPI.Models;

namespace PharmacyAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(IRepository<Category> repository) : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<CategoryDto>> Get() =>
        (await repository.GetAllAsync()).Select(x => new CategoryDto(x.CategoryId, x.CategoryName, x.Description));

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create(UpsertCategoryDto dto)
    {
        var category = new Category { CategoryName = dto.CategoryName, Description = dto.Description };
        await repository.AddAsync(category);
        await repository.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = category.CategoryId }, new CategoryDto(category.CategoryId, category.CategoryName, category.Description));
    }
}
