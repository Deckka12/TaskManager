using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Application.DTOs;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Interface
{
    public interface IWorkLogService
    {
        Task AddWorkLogAsync(WorkLogDto workLogDto);
        Task<List<WorkLog>> GetWorkLogsAsync(Guid taskId);
        Task<double> GetTotalHoursAsync(Guid taskId);
    }
}
