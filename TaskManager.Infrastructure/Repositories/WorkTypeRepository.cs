// IWorkTypeRepository.cs
using TaskManager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Interface;
using TaskManager.Infrastructure;
using TaskManager.Infrastructure.DBContext;

namespace TaskManager.Infrastructure.Repositories
{
    public class WorkTypeRepository : IWorkTypeRepository
    {
        private readonly AppDbContext _context;

        public WorkTypeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WorkType>> GetAllAsync()
        {
            return await _context.WorkType.ToListAsync();
        }

        public async Task<WorkType?> GetByIdAsync(Guid id)
        {
            return await _context.WorkType.FindAsync(id);
        }

        public async Task<bool> ExistsByNameAsync(string name)
        {
            return await _context.WorkType.AnyAsync(w => w.Name == name);
        }

        public async Task AddAsync(WorkType workType)
        {
            _context.WorkType.Add(workType);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var workType = await _context.WorkType.FindAsync(id);
            if (workType == null) return false;

            _context.WorkType.Remove(workType);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsUsedInWorkLogsAsync(Guid id)
        {
            return await _context.WorkLogs.AnyAsync(w => w.WorkTypeId == id);
        }
    }
}
