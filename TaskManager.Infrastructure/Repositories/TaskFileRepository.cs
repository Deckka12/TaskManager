using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.DBContext;

namespace TaskManager.Infrastructure.Repositories
{
    public class TaskFileRepository : ITaskFileRepository
    {
        private readonly AppDbContext _context;

        public TaskFileRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<TaskFile>> GetTaskFilesAsync(Guid taskId)
        {
            return await _context.TaskFiles
                .Where(f => f.TaskId == taskId)
                .ToListAsync();
        }

        public async Task<TaskFile?> GetFileByIdAsync(int fileId)
        {
            return await _context.TaskFiles.FindAsync(fileId);
        }

        public async Task AddFileAsync(TaskFile file)
        {
            _context.TaskFiles.Add(file);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteFileAsync(TaskFile file)
        {
            _context.TaskFiles.Remove(file);
            await _context.SaveChangesAsync();
        }
    }
}
