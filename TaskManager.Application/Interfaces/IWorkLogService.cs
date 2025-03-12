using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Interface
{
    public interface IWorkLogService
    {
        Task AddWorkLogAsync(Guid taskId, Guid userId, double hours, string workType, string comment);
        Task<List<WorkLog>> GetWorkLogsAsync(Guid taskId);
        Task<double> GetTotalHoursAsync(Guid taskId);
    }
}
