namespace PharmacyAPI.Helpers;

public class JwtSettings
{
    public string Key { get; set; } = "development-only-secret-key-change-me-please-123456";
    public string Issuer { get; set; } = "PharmacyAPI";
    public string Audience { get; set; } = "PharmacyUI";
    public int ExpiryMinutes { get; set; } = 120;
}
