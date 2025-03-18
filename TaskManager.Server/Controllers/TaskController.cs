using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Security.Claims;
using System.Threading.Tasks;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Application.Services;
using TaskManager.Domain.Entities;

namespace TaskManager.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITaskService _taskService;
        private readonly IProjectService _projectService;
        public TaskController(ITaskService taskService, IProjectService projectService, IUserService userService) 
        {
            _projectService = projectService;
            _userService = userService;
            _taskService = taskService;
        }

        /// <summary>
        /// Получаеам все задачи
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            var tasks = await _taskService.GetAllTasks();
            return Ok(tasks);
        }

        /// <summary>
        /// Получаем задачи по ИД
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTaskById(Guid id)
        {
            var task =  _taskService.GetAllTasks().Result.FirstOrDefault(x => x.Id == id);
            if (task == null)
                return NotFound();

            return Ok(task);
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteTask([FromBody] DeleteTaskRequest request)
        {
            if (!Guid.TryParse(request.Id, out Guid taskID))
            {
                return BadRequest(new { message = "Некорректный ID задачи" });
            }

            var task = await _taskService.GetTaskByIdAsync(taskID);
            if (task == null)
            {
                return NotFound(new { message = "Задача не найдена" });
            }
            try
            {
                await _taskService.DeleteTaskAsync(taskID);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.ToString() });
            }
            
            return Ok(new { message = "Задача удалена" });
        }

        // DTO для запроса удаления
        public class DeleteTaskRequest
        {
            public string Id { get; set; }
        }




        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] TaskDTO taskDto)
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

            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdClaim, out var userId) || userId == Guid.Empty)
            {
                return BadRequest(new { message = "Ошибка определения пользователя." });
            }

            taskDto.UserId = userId;

            var project = await _projectService.GetProjectByIdAsync(taskDto.ProjectId);
            if (project == null)
            {
                return BadRequest(new { message = "Выбранный проект не существует." });
            }

            try
            {
                await _taskService.CreateTaskAsync(taskDto);
                return Ok(new { message = "Задача успешно создана!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Ошибка сервера", error = ex.Message });
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
                Name = p.Name
            }).ToList();
            return Ok(projectModel);
        }
        [HttpGet("priorities")]
        public async Task<IActionResult> GetPriorities()
        {
            var priorities = Enum.GetValues(typeof(TaskManager.Domain.Enums.TaskPriority ))
                                 .Cast<TaskManager.Domain.Enums.TaskPriority>()
                                 .Select(p => new PriorityModel
                                 {
                                     ID = ((int)p).ToString(),
                                     Description = p.ToString()
                                 })
                                 .ToList();

            return Ok(priorities);
        }

        /// <summary>
        /// Получаеам все задачи
        /// </summary>
        /// <returns></returns>
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var tasks = await _userService.GetAllUsersAsync();
            return Ok(tasks);
        }
    }
    public class ProjectModel
    {
        public string ID { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
    }

    public class PriorityModel
    {
        public string ID { get; set; }
        public string Description { get; set; } = string.Empty;
    }
    public class CreateTaskModel
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid ProjectId { get; set; }
        public TaskManager.Domain.Enums.TaskPriority Priority { get; set; }
    }
}
