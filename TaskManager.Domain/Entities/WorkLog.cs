using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManager.Domain.Entities
{
    public class WorkLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TaskId { get; set; }
        public Guid? UserId { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public double HoursSpent { get; set; }
        public Guid WorkTypeId { get; set; }
        public WorkType WorkType { get; set; }
        public string? Comment { get; set; }

        public TaskItem? Task { get; set; }
        public User? User { get; set; }
        
    }


}
