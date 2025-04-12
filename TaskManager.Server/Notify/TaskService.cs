using TaskManager.Application.DTOs;

public class TaskServices
{
    private readonly NotificationServices _notificationService;

    public TaskServices(NotificationServices notificationService)
    {
        _notificationService = notificationService;
    }

    public async Task CreateTaskAsync(TaskDtos model)
    {
        // логика создания задачи
        await _notificationService.SendToAllAsync($"Задача '{model.Title}' была создана");
    }
}
