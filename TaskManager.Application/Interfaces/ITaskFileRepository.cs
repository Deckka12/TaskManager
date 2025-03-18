using System;
using System.Collections.Generic;
using System.Formats.Tar;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Interfaces
{
    public interface ITaskFileRepository
    {
        Task<List<TaskFile>> GetTaskFilesAsync(Guid taskId);
        Task<TaskFile?> GetFileByIdAsync(int fileId);
        Task AddFileAsync(TaskFile file);
        Task DeleteFileAsync(TaskFile file);
    }
}
