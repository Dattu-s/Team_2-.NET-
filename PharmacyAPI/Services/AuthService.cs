using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PharmacyAPI.Data;
using PharmacyAPI.DTOs;
using PharmacyAPI.Helpers;
using PharmacyAPI.Interfaces;
using PharmacyAPI.Models;

namespace PharmacyAPI.Services;

public class AuthService(PharmacyDbContext context, IOptions<JwtSettings> jwtOptions) : IAuthService
{
    private readonly JwtSettings _jwt = jwtOptions.Value;

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (await context.Users.AnyAsync(x => x.UserEmail == dto.UserEmail))
        {
            throw new InvalidOperationException("Email is already registered.");
        }

        var user = new User
        {
            UserName = dto.UserName,
            UserEmail = dto.UserEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = string.IsNullOrWhiteSpace(dto.Role) ? "Customer" : dto.Role
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();
        return ToAuthResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await context.Users.SingleOrDefaultAsync(x => x.UserEmail == dto.UserEmail);
        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        return ToAuthResponse(user);
    }

    private AuthResponseDto ToAuthResponse(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.UserEmail),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
        var token = new JwtSecurityToken(
            issuer: _jwt.Issuer,
            audience: _jwt.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwt.ExpiryMinutes),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return new AuthResponseDto(user.UserId, user.UserName, user.UserEmail, user.Role, new JwtSecurityTokenHandler().WriteToken(token));
    }
}
