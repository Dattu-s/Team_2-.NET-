namespace PharmacyAPI.DTOs;

public record MedicineDto(
    int MedicineId,
    string MedicineName,
    string? MedicineDescription,
    string MedicineDosage,
    decimal MedicinePrice,
    int MedicineStock,
    bool MedicineRequiresPrescription,
    string? MedicineImage,
    int CategoryId,
    string? CategoryName);

public record UpsertMedicineDto(
    string MedicineName,
    string? MedicineDescription,
    string MedicineDosage,
    decimal MedicinePrice,
    int MedicineStock,
    bool MedicineRequiresPrescription,
    string? MedicineImage,
    int CategoryId);
