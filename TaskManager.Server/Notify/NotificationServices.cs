// Services/NotificationService.cs
using Microsoft.AspNetCore.SignalR;

public class NotificationServices
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationServices(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendToAllAsync(string message)
    {
        await _hubContext.Clients.All.SendAsync("ReceiveNotification", message);
    }

    public async Task SendToUserAsync(string userId, string message)
    {
        await _hubContext.Clients.User(userId).SendAsync("ReceiveNotification", message);
    }
}
