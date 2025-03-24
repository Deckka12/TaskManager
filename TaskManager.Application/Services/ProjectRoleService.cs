using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interface;

namespace TaskManager.Application.Services
{
    public class ProjectRoleService : IProjectRoleService
    {
        private readonly IProjectRoleRepository _projectRoleRepository;
        public ProjectRoleService(IProjectRoleRepository projectRoleRepository)
        {
            _projectRoleRepository = projectRoleRepository;

        }
        public async Task<IEnumerable<ProjectRole>> GetAllProject()
        {
            return  await _projectRoleRepository.GetAllProjectRole();
        }
    }
}
