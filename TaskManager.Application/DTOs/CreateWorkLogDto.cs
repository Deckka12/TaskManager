using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManager.Application.DTOs
{
    public class CreateWorkLogDto
    {
        public double HoursSpent { get; set; }
        public string WorkType { get; set; } = string.Empty;
        public string? Comment { get; set; }
    }

}
