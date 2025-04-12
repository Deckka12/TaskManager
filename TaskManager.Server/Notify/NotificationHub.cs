// Hubs/NotificationHub.cs
using Microsoft.AspNetCore.SignalR;

public class NotificationHub : Hub
{
    private static readonly Dictionary<Guid, string> _userConnections = new();

    public override Task OnConnectedAsync()
    {
        var userIdStr = Context.GetHttpContext()?.Request.Query["userId"];
        if (Guid.TryParse(userIdStr, out var userId))
        {
            _userConnections[userId] = Context.ConnectionId;
        }
       

        return base.OnConnectedAsync();
    }


    public override Task OnDisconnectedAsync(Exception? exception)
    {
        var connection = _userConnections.FirstOrDefault(kvp => kvp.Value == Context.ConnectionId);
        if (!connection.Equals(default(KeyValuePair<Guid, string>)))
        {
            _userConnections.Remove(connection.Key);
        }

        return base.OnDisconnectedAsync(exception);
    }

    public static string? GetConnectionId(Guid userId)
    {
         
        _userConnections.TryGetValue(userId, out var connId);
        return connId;
    }
}

