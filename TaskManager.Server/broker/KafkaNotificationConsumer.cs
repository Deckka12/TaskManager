using Confluent.Kafka;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using TaskManager.Application.Services; // Подключи свой NotificationService
using Microsoft.AspNetCore.SignalR;

using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;

public class KafkaNotificationConsumer : BackgroundService
{
    private readonly ILogger<KafkaNotificationConsumer> _logger;
    private readonly INotificationService _notificationService;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly IConfiguration _config;

    public KafkaNotificationConsumer(
        ILogger<KafkaNotificationConsumer> logger,
        INotificationService notificationService,
        IHubContext<NotificationHub> hubContext,
        IConfiguration config)
    {
        _logger = logger;
        _notificationService = notificationService;
        _hubContext = hubContext;
        _config = config;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var config = new ConsumerConfig
        {
            BootstrapServers = _config["Kafka:BootstrapServers"], // например, localhost:9092
            GroupId = "task-notifications-group",
            AutoOffsetReset = AutoOffsetReset.Latest
        };

        using var consumer = new ConsumerBuilder<Ignore, string>(config).Build();
        consumer.Subscribe("task-notifications");

        try
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var result = consumer.Consume(stoppingToken);
                _logger.LogInformation($"📥 Получено сообщение из Kafka: {result.Message.Value}");

                // Десериализуем сообщение
                var notification = JsonSerializer.Deserialize<NotificationMessage>(result.Message.Value);

                if (notification != null)
                {
                    // 1. Сохраняем в базу
                    await _notificationService.SaveNotificationAsync(notification.UserId, notification.Message);

                    // 2. Отправляем через SignalR
                    await _hubContext.Clients.User(notification.UserId.ToString())
                        .SendAsync("ReceiveNotification", notification.Message);
                }
            }
        }
        catch (OperationCanceledException)
        {
            consumer.Close();
        }
    }

    public class NotificationMessage
    {
        public Guid UserId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
