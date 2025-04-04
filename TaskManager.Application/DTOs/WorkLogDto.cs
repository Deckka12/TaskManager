﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManager.Application.DTOs
{
    public class WorkLogDto
    {
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public double HoursSpent { get; set; }
        public string WorkType { get; set; }
        public string? Comment { get; set; }
        public DateTime? Date { get; set; }
    }

}
