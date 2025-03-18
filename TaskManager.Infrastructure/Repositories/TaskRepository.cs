using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Interface;

namespace TaskManager.Infrastructure.Repositories
{
    public class TaskRepository : GenericRepository<TaskItem>, ITaskRepository
    {
        private readonly AppDbContext _context;

        public TaskRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskItem>> GetByUserIdAsync(Guid userId)
        {
            return await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task != null)
            {
                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<TaskItem?> GetByIdWithWorkLogsAsync(Guid id)
        {
            return await _context.Tasks
                .Include(t => t.WorkLogs) 
                .ThenInclude(u => u.User)
                .FirstOrDefaultAsync(t => t.Id == id);
        }
        public async Task<IEnumerable<TaskItem>> GetByAllTask()
        {
            return await _context.Tasks
               .Include(t => t.Project).Include(x => x.User).ToListAsync();
               
        }
    }
}
