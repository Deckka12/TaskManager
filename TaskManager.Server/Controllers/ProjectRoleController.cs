using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using TaskManager.Application.Interfaces;
using TaskManager.Application.Services;
using TaskManager.Domain.Entities;

namespace TaskManager.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectRoleController : ControllerBase
    {
        public IProjectRoleService _projectRoleService;
        public ProjectRoleController(IProjectRoleService projectRoleService)
        {
            _projectRoleService = projectRoleService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectRole>>> GetProject()
        {
            var project = await _projectRoleService.GetAllProject();
            return Ok(project);
        }
    }
}
