using MailKit.Net.Smtp;
using MimeKit;
using PharmacyAPI.Interfaces;

namespace PharmacyAPI.Services;

public class EmailService(IConfiguration configuration, ILogger<EmailService> logger) : IEmailService
{
    public async Task SendAsync(string to, string subject, string body)
    {
        var section = configuration.GetSection("Smtp");
        var host = section["Host"];
        if (string.IsNullOrWhiteSpace(host))
        {
            logger.LogInformation("SMTP is not configured. Email skipped: {Subject} to {To}", subject, to);
            return;
        }

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(section["From"] ?? "noreply@pharmacy.local"));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new TextPart("plain") { Text = body };

        using var client = new SmtpClient();
        await client.ConnectAsync(host, int.Parse(section["Port"] ?? "587"), MailKit.Security.SecureSocketOptions.StartTls);
        var username = section["Username"];
        var password = section["Password"];
        if (!string.IsNullOrWhiteSpace(username) && password is not null)
        {
            await client.AuthenticateAsync(username, password);
        }
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}
