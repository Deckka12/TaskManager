using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Interfaces
{
    public interface ITaskFileService
    {
        Task<List<TaskFile>> GetTaskFilesAsync(Guid taskId);
        Task<TaskFile?> GetFileByIdAsync(int fileId);
        Task<bool> UploadFileAsync(Guid taskId, string fileName, byte[] fileData, string contentType);
        Task<bool> DeleteFileAsync(int fileId);
    }
}
