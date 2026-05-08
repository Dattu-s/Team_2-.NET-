using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PharmacyAPI.Data;
using PharmacyAPI.Interfaces;

namespace PharmacyAPI.Repositories;

public class Repository<T>(PharmacyDbContext context) : IRepository<T> where T : class
{
    private readonly DbSet<T> _set = context.Set<T>();

    public Task<List<T>> GetAllAsync() => _set.AsNoTracking().ToListAsync();
    public Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate) => _set.Where(predicate).ToListAsync();
    public Task<T?> GetByIdAsync(int id) => _set.FindAsync(id).AsTask();
    public async Task<T> AddAsync(T entity)
    {
        await _set.AddAsync(entity);
        return entity;
    }
    public void Update(T entity) => _set.Update(entity);
    public void Delete(T entity) => _set.Remove(entity);
    public Task SaveChangesAsync() => context.SaveChangesAsync();
}
