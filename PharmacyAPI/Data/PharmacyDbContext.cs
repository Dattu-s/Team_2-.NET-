using Microsoft.EntityFrameworkCore;
using PharmacyAPI.Models;

namespace PharmacyAPI.Data;

public class PharmacyDbContext(DbContextOptions<PharmacyDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Medicine> Medicines => Set<Medicine>();
    public DbSet<CartItem> Cart => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Prescription> Prescriptions => Set<Prescription>();
    public DbSet<LoyaltyPoint> LoyaltyPoints => Set<LoyaltyPoint>();
    public DbSet<HealthPackage> HealthPackages => Set<HealthPackage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var seedDate = new DateTime(2026, 5, 8, 0, 0, 0, DateTimeKind.Utc);
        modelBuilder.Entity<User>().HasIndex(x => x.UserEmail).IsUnique();
        modelBuilder.Entity<CartItem>().HasKey(x => x.CartId);
        modelBuilder.Entity<LoyaltyPoint>().HasKey(x => x.LoyaltyId);
        modelBuilder.Entity<HealthPackage>().HasKey(x => x.PackageId);
        modelBuilder.Entity<Medicine>().Property(x => x.MedicinePrice).HasPrecision(18, 2);
        modelBuilder.Entity<Order>().Property(x => x.TotalAmount).HasPrecision(18, 2);
        modelBuilder.Entity<OrderItem>().Property(x => x.Price).HasPrecision(18, 2);
        modelBuilder.Entity<HealthPackage>().Property(x => x.Price).HasPrecision(18, 2);

        modelBuilder.Entity<Category>().HasData(
            new Category { CategoryId = 1, CategoryName = "Pain Relief", Description = "Analgesics and anti-inflammatory medicines" },
            new Category { CategoryId = 2, CategoryName = "Vitamins", Description = "Daily wellness supplements" },
            new Category { CategoryId = 3, CategoryName = "Prescription", Description = "Prescription-only medicines" });

        modelBuilder.Entity<Medicine>().HasData(
            new Medicine { MedicineId = 1, MedicineName = "Paracetamol", MedicineDescription = "Fever and mild pain relief", MedicineDosage = "500mg", MedicinePrice = 35, MedicineStock = 120, MedicineRequiresPrescription = false, CategoryId = 1, MedicineImage = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600", CreatedDate = seedDate },
            new Medicine { MedicineId = 2, MedicineName = "Vitamin C", MedicineDescription = "Immunity support tablets", MedicineDosage = "1000mg", MedicinePrice = 199, MedicineStock = 80, MedicineRequiresPrescription = false, CategoryId = 2, MedicineImage = "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600", CreatedDate = seedDate },
            new Medicine { MedicineId = 3, MedicineName = "Amoxicillin", MedicineDescription = "Antibiotic, prescription required", MedicineDosage = "250mg", MedicinePrice = 145, MedicineStock = 45, MedicineRequiresPrescription = true, CategoryId = 3, MedicineImage = "https://images.unsplash.com/photo-1550572017-edd951aa8f3f?w=600", CreatedDate = seedDate });

        modelBuilder.Entity<HealthPackage>().HasData(
            new HealthPackage { PackageId = 1, PackageName = "Seasonal Wellness", Price = 699, Description = "Basic health screening and vitamins offer" });
    }
}
