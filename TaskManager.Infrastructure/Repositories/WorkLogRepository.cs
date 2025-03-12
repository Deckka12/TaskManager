using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interface;
using TaskManager.Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;

namespace TaskManager.Infrastructure.Repositories
{
    public class WorkLogRepository : IWorkLogRepository
    {
        private readonly AppDbContext _context;

        public WorkLogRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(WorkLog workLog)
        {
            _context.WorkLogs.Add(workLog);
            await _context.SaveChangesAsync();
        }

        public async Task<List<WorkLog>> GetByTaskIdAsync(Guid taskId)
        {
            return await _context.WorkLogs
                .Where(w => w.TaskId == taskId)
                .OrderByDescending(w => w.Date)
                .ToListAsync();
        }

        public async Task<double> GetTotalHoursAsync(Guid taskId)
        {
            return await _context.WorkLogs
                .Where(w => w.TaskId == taskId)
                .SumAsync(w => w.HoursSpent);
        }
    }
}
