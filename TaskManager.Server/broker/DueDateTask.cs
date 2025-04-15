using Confluent.Kafka;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using TaskManager.Application.Interfaces;

namespace TaskManager.Server.broker
{
    public class DueDateTask : BackgroundService
    {
        private readonly ILogger<DueDateTask> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private static readonly TimeSpan IntervalStart = TimeSpan.FromSeconds(100);
        private static readonly TimeSpan Interval = TimeSpan.FromDays(1);

        public DueDateTask(ILogger<DueDateTask> logger, IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await Task.Delay(IntervalStart, stoppingToken);
            // Запуск при старте
            await ProcessDueTasksAsync(stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Ждём 24 часа
                    await Task.Delay(Interval, stoppingToken);

                    await ProcessDueTasksAsync(stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    // Выход из цикла при остановке
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Ошибка при выполнении задачи просроченных задач");
                }
            }
        }
        private async Task ProcessDueTasksAsync(CancellationToken stoppingToken)
        {
            using var scope = _scopeFactory.CreateScope();

            var taskService = scope.ServiceProvider.GetRequiredService<ITaskService>();
            var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
            var notifier = scope.ServiceProvider.GetRequiredService<INotificationService>();
            var service1 = scope.ServiceProvider.GetRequiredService<IHubContext<NotificationHub>>();

            var now = DateTime.UtcNow;

            var tasks = await taskService.GetAllTasks();
            var overdueTasks = tasks
            .Where(t => t.DueDate < now)
            .ToList();

            foreach (var task in overdueTasks)
            {
                var notificates = await notificationService.GetAllByUserAsync(task.PerformerId.Value);

                var message = $"Задача {task.Title} {task.Description} просрчоена";
                if (notificates != null && notificates.Any(x => x.Message.Equals(message, StringComparison.OrdinalIgnoreCase)))
                    continue;

                var connId = NotificationHub.GetConnectionId(task.PerformerId.Value);
                notifier.SaveNotificationAsync(task.PerformerId.Value, message).Wait();
                if (connId != null)
                    service1.Clients.Client(connId).SendAsync("ReceiveNotification", message);
            }
        }
    }
}
