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
    public class TaskDtos
    {
        public Guid Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string ProjectName { get; set; }

        public TaskStatus Status { get; set; } = TaskStatus.New;

        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public string UserName { get; set; }
        public Guid UserId { get; set; }
        public Guid ProjectId { get; set; }  // ✅ Добавлено
        public Guid? PerformerId { get; set; }  // ✅ Добавлено
        public Guid? CategoryId { get; set; }  // ✅ Добавлено
        public DateTime? DueDate { get; set; }  // ✅ Добавлено

        public List<WorkLogDto>? workLogs { get; set; }

    }
}
