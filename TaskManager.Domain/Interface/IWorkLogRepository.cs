using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;

namespace TaskManager.Domain.Interface
{
    public interface IWorkLogRepository
    {
        Task AddAsync(WorkLog workLog);
        Task<List<WorkLog>> GetByTaskIdAsync(Guid taskId);
        Task<double> GetTotalHoursAsync(Guid taskId);
    }

}
