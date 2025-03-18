using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interface;
using static Microsoft.AspNetCore.Hosting.Internal.HostingApplication;


namespace TaskManager.Application.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly IUserRepository _userRepository;


        public TaskService(ITaskRepository taskRepository, IProjectRepository projectRepository, IUserRepository userRepository)
        {
            _taskRepository = taskRepository;
            _projectRepository = projectRepository;
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<TaskDTO>> GetAllTasksAsync()
        {
            var tasks = await _taskRepository.GetAllAsync();
            return tasks.Select(t => new TaskDTO
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority
            }).ToList();
        }

        public async Task<TaskDTO?> GetTaskByIdAsync(Guid id)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            return task == null ? null : new TaskDTO
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                workLogs = task.WorkLogs.ToList(),
            };
        }

        public async Task CreateTaskAsync(TaskDTO taskDto)
        {
            // Проверяем, существует ли пользователь
            var userExists = await _userRepository.GetByIdAsync(taskDto.UserId);
            if (userExists == null)
            {
                throw new InvalidOperationException("Пользователь с таким ID не существует.");
            }

            // Проверяем, существует ли проект
            var projectExists = await _projectRepository.GetByIdAsync(taskDto.ProjectId);
            if (projectExists == null)
            {
                throw new InvalidOperationException("Проект с таким ID не существует.");
            }

            var task = new TaskItem
            {
                Id = Guid.NewGuid(),
                Title = taskDto.Title,
                Description = taskDto.Description,
                Status = taskDto.Status,
                Priority = taskDto.Priority,
                UserId = taskDto.UserId,
                ProjectId = taskDto.ProjectId
            };

            await _taskRepository.AddAsync(task);
        }


        public async Task UpdateTaskAsync(TaskDTO taskDto)
        {
            var task = await _taskRepository.GetByIdAsync(taskDto.Id);
            if (task != null)
            {
                task.Title = taskDto.Title;
                task.Description = taskDto.Description;
                task.Status = taskDto.Status;
                task.Priority = taskDto.Priority;
                await _taskRepository.UpdateAsync(task);
            }
        }

        public async Task DeleteTaskAsync(Guid id)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task != null)
            {
                await _taskRepository.DeleteAsync(task);
            }
        }

        public async Task<IEnumerable<TaskDTO>> GetTasksByUser(Guid userId)
        {
            var tasks = await _taskRepository.GetByUserIdAsync(userId);  // Используем метод репозитория для получения задач
            return tasks.Select(t => new TaskDTO
            {
                Id = t.Id,
                Title = t.Title,
                Status = t.Status,
                Priority = t.Priority // Добавляем дату создания, если необходимо
            }).ToList();
        }

        public async Task<IEnumerable<TaskDtos>> GetAllTasks()
        {
            var tasks = await _taskRepository.GetByAllTask();  // Используем метод репозитория для получения задач
            return tasks.Select(t => new TaskDtos
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                ProjectName = t.Project.Name,
                UserName = t.User.Name,
                UserId = t.UserId
            }).ToList();
        }
    }
}
