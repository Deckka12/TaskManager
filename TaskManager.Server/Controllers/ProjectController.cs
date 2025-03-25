using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;

namespace TaskManager.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {

        private readonly IProjectService _projectService;
        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] ProjectDTO projectDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Ошибка валидации",
                    errors = ModelState
                        .Where(kv => kv.Value.Errors.Count > 0)
                        .ToDictionary(kv => kv.Key, kv => kv.Value.Errors.Select(e => e.ErrorMessage).ToArray())
                });
            }

            try
            {
                await _projectService.CreateProjectAsync(projectDto);
                return Ok(new { message = "Задача успешно создана!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Ошибка сервера", error = ex.ToString() });
            }
        }

        [HttpGet("project")]
        public async Task<IActionResult> GetProject()
        {
            var projects = await _projectService.GetAllProjectsAsync();

            var projectModel = projects.Select(p => new ProjectModel
            {
                ID = p.Id.ToString(),
                Description = p.Description,
                Name = p.Name,
                UserRoles = p.UserRoles.Select(ur => new ProjectUserRoleModel
                {
                    UserId = ur.UserId.ToString(),
                    RoleId = ur.RoleId.ToString(),
                    RoleName = ur.RoleName.ToString(),
                    UserName = ur.UserName.ToString(),
                }).ToList()
            }).ToList();

            return Ok(projectModel);
        }

    }
    public class ProjectModel
    {
        public string ID { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public List<ProjectUserRoleModel> UserRoles { get; set; } = new();
    }
    public class ProjectUserRoleModel
    {
        public string UserId { get; set; } = string.Empty;
        public string RoleId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
    }
}
