using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interface;

namespace TaskManager.Domain.Interface
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task AddUserAsync(User user);
        Task<User?> GetUserByEmailWithRolesAsync(string email);
        Task<IEnumerable<User>> GetByAllUser();
        Task<IEnumerable<Role>> GetByAllRole();
        Task<bool> UpdateUserWithRolesAsync(Guid userId, string name, string email, List<string> roleNames);


    }
}
