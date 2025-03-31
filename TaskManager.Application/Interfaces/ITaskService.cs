using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Application.DTOs;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDTO>> GetAllTasksAsync();
        Task<TaskDTO?> GetTaskByIdAsync(Guid id);
        Task CreateTaskAsync(TaskDTO taskDto);
        Task UpdateTaskAsync(TaskDTO taskDto);
        Task DeleteTaskAsync(Guid id);
        Task<IEnumerable<TaskDtos>> GetTasksByUser(Guid userId);

        Task<IEnumerable<TaskDtos>> GetAllTasks();
        Task<IEnumerable<TaskDtos>> GetTasksByProjectIdAsync(Guid guid);
        Task<IEnumerable<Category>> GetAllCategory();
        Task<bool> UpdateTaskAsync(Guid taskId, UpdateTaskDto updateTaskDto);
    }
}
