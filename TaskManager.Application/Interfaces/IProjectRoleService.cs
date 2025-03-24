using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Application.DTOs;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Interfaces
{
    public interface IProjectRoleService
    {
        Task<IEnumerable<ProjectRole>> GetAllProject();
    }
}
