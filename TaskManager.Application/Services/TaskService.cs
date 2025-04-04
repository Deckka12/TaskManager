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
                ProjectId = taskDto.ProjectId,
                CategotyID = taskDto.CategoryId,
                DueDate = taskDto.DueDate,
                PerformerID = taskDto.PerformerId
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

        public async Task<IEnumerable<TaskDtos>> GetTasksByUser(Guid userId)
        {
            var tasks = await _taskRepository.GetByUserIdAsync(userId);  // Используем метод репозитория для получения задач
            return tasks.Select(t => new TaskDtos
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                ProjectName = t.Project.Name,
                UserName = t.User.Name,
                UserId = t.UserId,
                ProjectId = t.ProjectId,
                PerformerId = t.PerformerID,
                DueDate = t.DueDate,
                CategoryId = t.CategotyID
               
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
                UserId = t.UserId,
                ProjectId = t.ProjectId,
                PerformerId = t.PerformerID,
                DueDate = t.DueDate,
                CategoryId = t.CategotyID,
                workLogs = t.WorkLogs.Select(log => new WorkLogDto
                {
                    TaskId = log.TaskId,
                    UserId = log.UserId ?? Guid.Empty,
                    UserName = log.User?.Name ?? "—", // <- здесь!
                    HoursSpent = log.HoursSpent,
                    WorkType = log.WorkType,
                    Comment = log.Comment,
                    Date = log.Date

                }).ToList()
            }).ToList();
        }

        public async Task<IEnumerable<Category>> GetAllCategory()
        {
            var tasks = await _taskRepository.GetAllCategory();
            return tasks;
        }

        public async Task<bool> UpdateTaskAsync(Guid taskId, UpdateTaskDto updateTaskDto)
        {
            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null)
                return false;

            bool isUpdated = false;

            if (!string.IsNullOrEmpty(updateTaskDto.Title) && task.Title != updateTaskDto.Title)
            {
                task.Title = updateTaskDto.Title;
                isUpdated = true;
            }

            if (!string.IsNullOrEmpty(updateTaskDto.Description) && task.Description != updateTaskDto.Description)
            {
                task.Description = updateTaskDto.Description;
                isUpdated = true;
            }

            if (updateTaskDto.Status.HasValue && task.Status != updateTaskDto.Status.Value)
            {
                task.Status = updateTaskDto.Status.Value;
                isUpdated = true;
            }

            if (updateTaskDto.Priority.HasValue && task.Priority != updateTaskDto.Priority.Value)
            {
                task.Priority = updateTaskDto.Priority.Value;
                isUpdated = true;
            }

            if (task.DueDate != updateTaskDto.DueDate)
            {
                task.DueDate = updateTaskDto.DueDate;
                isUpdated = true;
            }

            if (task.PerformerID != updateTaskDto.PerformerId)
            {
                task.PerformerID = updateTaskDto.PerformerId;
                isUpdated = true;
            }
            if (task.ProjectId != updateTaskDto.ProjectId)
            {
                task.ProjectId = updateTaskDto.ProjectId.Value;
                isUpdated = true;
            }
            if (task.CategotyID != updateTaskDto.CategoryId)
            {
                task.CategotyID = updateTaskDto.CategoryId.Value;
                isUpdated = true;
            }

            if (!isUpdated)
                return false;

            task.ChangedDate = DateTime.UtcNow;
            await _taskRepository.UpdateAsync(task);

            return true;
        }

        public async Task<IEnumerable<TaskDtos>> GetTasksByProjectIdAsync(Guid guid)
        {
            var tasksbyProject =  await _taskRepository.GetTasksByProjectIdAsync(guid);
            return tasksbyProject.Select(t => new TaskDtos
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                ProjectName = t.Project.Name,
                UserName = t.User.Name,
                UserId = t.UserId,
                ProjectId = t.ProjectId,
                PerformerId = t.PerformerID,
                DueDate = t.DueDate,
                CategoryId = t.CategotyID
            }).ToList();
        }
    }
}
