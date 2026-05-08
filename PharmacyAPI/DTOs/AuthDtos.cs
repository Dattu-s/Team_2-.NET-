namespace PharmacyAPI.DTOs;

public record RegisterDto(string UserName, string UserEmail, string Password, string Role = "Customer");
public record LoginDto(string UserEmail, string Password);
public record AuthResponseDto(int UserId, string UserName, string UserEmail, string Role, string Token);
