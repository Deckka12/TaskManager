using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Interfaces
{
    public interface IProjectService
    {
        Task<IEnumerable<ProjectDTO>> GetAllProjectsAsync();
        Task<ProjectDTO?> GetProjectByIdAsync(Guid id);
        Task CreateProjectAsync(ProjectDTO projectDto);
        Task DeleteProjectAsync(Guid id);
    }
}
