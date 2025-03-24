using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;

namespace TaskManager.Domain.Interface
{
    public interface IProjectRoleRepository : IRepository<ProjectRole>
    {
        Task<IEnumerable<ProjectRole>> GetAllProjectRole();
    }
}
