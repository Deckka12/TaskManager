using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Interfaces;
using TaskManager.Application.Services;
using TaskManager.Domain.Entities;

namespace TaskManager.Server.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IProjectService _projectService;
        public UserController(IUserService userService, IProjectService projectService)
        {
            _projectService = projectService;

            _userService = userService;
        }
        /// <summary>
        /// Получаеам все задачи
        /// </summary>
        /// <returns></returns>
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var tasks = await _userService.GetAllUsersAsync();
            return Ok(tasks);
        }
    }
}
