using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interface;
using TaskManager.Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;

namespace TaskManager.Infrastructure.Repositories
{
    public class ProjectRepository : GenericRepository<Project>, IProjectRepository
    {
        private readonly AppDbContext _context;

        public ProjectRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Project>> GetAllProjectsAsync()
        {
            return await _context.Projects
                .Include(p => p.ProjectUserRoles)                // Загружаем роли проекта
                    .ThenInclude(pur => pur.User)                // И пользователей этих ролей
                .Include(p => p.ProjectUserRoles)                // Можно также повторить для читаемости
                    .ThenInclude(pur => pur.Role)                // И названия самих ролей
                .Include(p => p.Owner)                           // Владелец проекта
                .ToListAsync();
        }


        public async Task<Project?> GetProjectByIdAsync(Guid id)
        {
            return await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}
