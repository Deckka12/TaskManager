using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Enums;
using TaskStatus = TaskManager.Domain.Enums.TaskStatus;

namespace TaskManager.Domain.Entities
{
    public class TaskItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TaskStatus Status { get; set; } = TaskStatus.New;
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public DateTime? DueDate { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.UtcNow;
        public DateTime ChangedDate { get; set; } = DateTime.UtcNow;

        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        public Guid? PerformerID { get; set; }
        public User? Performer { get; set; } = null!;
        public Guid? CategotyID { get; set; }
        public Category? Category { get; set; } = null!;

        public Guid ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public virtual ICollection<WorkLog> WorkLogs { get; set; } = new List<WorkLog>(); // 🔹 Если WorkLogs связан с задачей
    }

    
}
