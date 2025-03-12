using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interface;

namespace TaskManager.Application.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IUserRepository _userRepository;

        public ProjectService(IProjectRepository projectRepository, IUserRepository userRepository)
        {
            _projectRepository = projectRepository;
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<ProjectDTO>> GetAllProjectsAsync()
        {
            var projects = await _projectRepository.GetAllAsync();
            return projects.Select(p => new ProjectDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description
            }).ToList();
        }

        public async Task<ProjectDTO?> GetProjectByIdAsync(Guid id)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            return project == null ? null : new ProjectDTO
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description
            };
        }

        public async Task CreateProjectAsync(ProjectDTO projectDto)
        {
            // Проверяем, существует ли пользователь
            var userExists = await _userRepository.GetByIdAsync(projectDto.OwnerId);
            if (userExists == null)
            {
                throw new InvalidOperationException("Пользователь с таким ID не существует.");
            }

            var project = new Project
            {
                Id = Guid.NewGuid(),
                Name = projectDto.Name,
                Description = projectDto.Description,
                OwnerId = projectDto.OwnerId
            };

            await _projectRepository.AddAsync(project);
        }


        public async Task DeleteProjectAsync(Guid id)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            if (project != null)
            {
                await _projectRepository.DeleteAsync(project);
            }
        }
    }
}
