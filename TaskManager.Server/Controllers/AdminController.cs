using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Application.Services;
using TaskManager.Domain.Interface;

namespace TaskManager.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly IProjectService _projectService;
        private readonly ITaskService _taskService;
        public AdminController(IUserRepository userRepository, IProjectService projectService, ITaskService taskService)
        {
            _userRepository = userRepository;
            _projectService = projectService;
            _taskService = taskService;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userRepository.GetByAllUser();
            return Ok(users);
        }

        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles()
        {
            var role = await _userRepository.GetByAllRole();
            return Ok(role);

        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDto model)
        {
            var success = await _userRepository.UpdateUserWithRolesAsync(id, model.Name, model.Email, model.Roles);

            if (!success)
                return NotFound(new { message = "Пользователь не найден" });

            return Ok(new { message = "Пользователь обновлён" });
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categorys = await _taskService.GetAllCategory();
            var categoryModel = categorys.Select(p => new CategoryModel
            {
                ID = p.Id.ToString(),
                Name = p.Name
            }).ToList();
            return Ok(categoryModel);
        }
    }
}
