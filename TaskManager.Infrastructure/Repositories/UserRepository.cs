using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using TaskManager.Infrastructure.DBContext;
using TaskManager.Domain.Interface;

namespace TaskManager.Infrastructure.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetUserByEmailWithRolesAsync(string email)
        {
            return await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<IEnumerable<User>> GetByAllUser()
        {
            return await _context.Users
                 .Include(u => u.UserRoles)
                 .ThenInclude(ur => ur.Role).ToListAsync();
        }

        public async Task<IEnumerable<Role>> GetByAllRole()
        {
            return await _context.Role.ToListAsync();
        }

        public async Task<bool> UpdateUserWithRolesAsync(Guid userId, string name, string email, List<string> roleNames)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return false;

            user.Name = name;
            user.Email = email;

            // Удаляем старые роли
            user.UserRoles.Clear();

            // Назначаем новые роли
            var roles = await _context.Role 
                .Where(r => roleNames.Contains(r.Name))
                .ToListAsync();

            foreach (var role in roles)
            {
                user.UserRoles.Add(new UserRole { UserId = userId, RoleId = role.Id });
            }

            await _context.SaveChangesAsync();
            return true;
        }

    }
}
