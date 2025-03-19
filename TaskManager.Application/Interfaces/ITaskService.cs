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
        Task<IEnumerable<TaskDTO>> GetTasksByUser(Guid userId);

        Task<IEnumerable<TaskDtos>> GetAllTasks();
        Task<IEnumerable<Category>> GetAllCategory();
    }
}
