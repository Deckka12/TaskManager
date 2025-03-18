using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Services
{
    public class TaskFileService : ITaskFileService
    {
        private readonly ITaskFileRepository _taskFileRepository;
        private readonly ITaskService _taskService;

        public TaskFileService(ITaskFileRepository taskFileRepository, ITaskService taskService)
        {
            _taskFileRepository = taskFileRepository;
            _taskService = taskService;
        }

        public async Task<List<TaskFile>> GetTaskFilesAsync(Guid taskId)
        {
            return await _taskFileRepository.GetTaskFilesAsync(taskId);
        }

        public async Task<TaskFile?> GetFileByIdAsync(int fileId)
        {
            return await _taskFileRepository.GetFileByIdAsync(fileId);
        }

        public async Task<bool> UploadFileAsync(Guid taskId, string fileName, byte[] fileData, string contentType)
        {
            var task = await _taskService.GetTaskByIdAsync(taskId);
            if (task == null)
            {
                return false; // Задача не найдена
            }

            var file = new TaskFile
            {
                TaskId = taskId,
                FileName = fileName,
                Data = fileData,
                ContentType = contentType
            };

            await _taskFileRepository.AddFileAsync(file);
            return true;
        }

        public async Task<bool> DeleteFileAsync(int fileId)
        {
            var file = await _taskFileRepository.GetFileByIdAsync(fileId);
            if (file == null)
            {
                return false; // Файл не найден
            }

            await _taskFileRepository.DeleteFileAsync(file);
            return true;
        }
    }
}
