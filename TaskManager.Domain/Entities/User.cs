using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManager.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? TelegramId { get; set; }

        public ICollection<Project> Projects { get; set; } = new List<Project>();
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>(); 
        public ICollection<WorkLog> WorkLogs { get; set; } = new List<WorkLog>(); 
        public ICollection<TaskFile> TaskFiles { get; set; } = new List<TaskFile>();
        public ICollection<ProjectUserRole> ProjectUserRoles { get; set; }
    }

}
