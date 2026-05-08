namespace PharmacyAPI.DTOs;

public record PrescriptionDto(int PrescriptionId, int UserId, string FilePath, string Status, DateTime UploadedDate);
public record UpdatePrescriptionStatusDto(string Status);
