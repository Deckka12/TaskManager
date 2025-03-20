using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Enums;

namespace TaskManager.Application.DTOs
{
    public class UpdateTaskDto
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public Domain.Enums.TaskStatus? Status { get; set; }
        public TaskPriority? Priority { get; set; }
        public DateTime? DueDate { get; set; }
        public Guid? PerformerId { get; set; }
        public Guid? CategoryId { get; set; }
        public Guid? ProjectId { get; set; }
    }

}
