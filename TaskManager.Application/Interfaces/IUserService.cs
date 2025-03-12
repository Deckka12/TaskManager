using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDTO>> GetAllUsersAsync();
        Task<UserDTO?> GetUserByIdAsync(Guid id);
        Task CreateUserAsync(UserDTO userDto);
        Task<UserDTO?> AuthenticateAsync(string email, string password);
        Task<bool> LoginAsync(string email, string password);
        Task LogoutAsync();
    }
}
