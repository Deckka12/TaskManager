using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;
using TaskStatus = TaskManager.Domain.Enums.TaskStatus;

namespace TaskManager.Application.DTOs
{
    public class TaskDTO
    {
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Название задачи обязательно")]
        [StringLength(100, ErrorMessage = "Название не может превышать 100 символов")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Описание задачи обязательно")]
        [StringLength(500, ErrorMessage = "Описание не может превышать 500 символов")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Необходимо выбрать проект")]
        public Guid ProjectId { get; set; }

        [Required(ErrorMessage = "Необходимо выбрать статус")]
        public TaskStatus Status { get; set; } = TaskStatus.New;

        [Required(ErrorMessage = "Необходимо выбрать приоритет")]
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public Guid UserId { get; set; }

        [Required(ErrorMessage = "Необходимо выбрать категорию")]
        public Guid CategoryId { get; set; }
        public DateTime DueDate { get; set; }
        public Guid PerformerId { get; set; }

        public List<WorkLog>? workLogs { get; set; }

        // Локализация статусов
        public string StatusText => Status switch
        {
            TaskStatus.New => "Новая",
            TaskStatus.InProgress => "В процессе",
            TaskStatus.Completed => "Завершена",
            _ => "Неизвестно"
        };

        // Локализация приоритетов
        public string PriorityText => Priority switch
        {
            TaskPriority.Low => "Низкий",
            TaskPriority.Medium => "Средний",
            TaskPriority.High => "Высокий",
            _ => "Неизвестно"
        };
    }
}
