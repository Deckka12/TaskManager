using Confluent.Kafka;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using TaskManager.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;
using TaskManager.Domain.Entities;
using TaskManager.Application.DTOs;

public class KafkaNotificationConsumer : BackgroundService
{
    private readonly ILogger<KafkaNotificationConsumer> _logger;
    private readonly IServiceScopeFactory _scopeFactory;

    public KafkaNotificationConsumer(ILogger<KafkaNotificationConsumer> logger, IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("✅ KafkaNotificationConsumer запущен");

        Task.Run(() =>
        {
            var config = new ConsumerConfig
            {
                BootstrapServers = "localhost:9092",
                GroupId = "taskmanager-notification-group",
                AutoOffsetReset = AutoOffsetReset.Earliest
            };

            using var consumer = new ConsumerBuilder<Ignore, string>(config).Build();
            consumer.Subscribe("notifications");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var result = consumer.Consume(stoppingToken);
                    var message = JsonSerializer.Deserialize<NotificationMessage>(result.Message.Value);

                    using var scope = _scopeFactory.CreateScope();
                    var service = scope.ServiceProvider.GetRequiredService<INotificationService>();
                    var service1 = scope.ServiceProvider.GetRequiredService<IHubContext<NotificationHub>>();
                    if (message != null)
                    {
                        var connId = NotificationHub.GetConnectionId(new Guid(message.UserId));
                        service.SaveNotificationAsync(new Guid(message.UserId), message.Message).Wait();
                        service1.Clients.Client(connId).SendAsync("ReceiveNotification", message.Message);
                    }
                         // или `.GetAwaiter().GetResult();`
                }
                catch (OperationCanceledException)
                {
                    consumer.Close(); // нормальное завершение
                }
                catch (Exception ex)
                {
                    _logger.LogError($"❌ Kafka Error: {ex.Message}");
                }
            }

        }, stoppingToken);

        return Task.CompletedTask;
    }

}

public class NotificationMessage
{
    public string UserId { get; set; } = default!;
    public string Message { get; set; } = default!;
}
