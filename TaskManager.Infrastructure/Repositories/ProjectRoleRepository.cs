using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interface;
using TaskManager.Infrastructure.DBContext;

namespace TaskManager.Infrastructure.Repositories
{
    public class ProjectRoleRepository : GenericRepository<ProjectRole>, IProjectRoleRepository
    {
        private readonly AppDbContext _context;

        public ProjectRoleRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }
        public async Task<IEnumerable<ProjectRole>> GetAllProjectRole()
        {
            return await _context.ProjectRoles.ToListAsync();
        }
    }
}
