using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interface;
using TaskManager.Application.Interfaces;
using TaskManager.Application.Services;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interface;

namespace TaskManager.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITaskService _taskService;
        private readonly IWorkLogService _workLogService;
        private readonly IProjectService _projectService;
        private readonly IDistributedCache _cache;
        private readonly ILogger<TaskController> _logger;
        private readonly INotificationService _notificationService;
        private readonly INotificationRepository _notificationRepository;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly KafkaProducer _kafkaProducer;

        public TaskController(ITaskService taskService, IProjectService projectService, IUserService userService
            , IDistributedCache cache, ILogger<TaskController> logger, IWorkLogService workLogService, INotificationService notificationService
            , INotificationRepository notificationRepository
            , IHubContext<NotificationHub> hubContext
            , KafkaProducer kafkaProducer) 
        {
            _projectService = projectService;
            _userService = userService;
            _taskService = taskService;
            _cache = cache;
            _logger = logger;
            _workLogService = workLogService;
            _notificationService = notificationService;
            _notificationRepository = notificationRepository;
            _hubContext = hubContext;
            _kafkaProducer = kafkaProducer;
        }

        /// <summary>
        /// Получаем все задачи (с кешированием)
        /// </summary>
        /// <returns>Список задач</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            try
            {
                //const string cacheKey = "all_tasks";
                //var cached = await _cache.GetStringAsync(cacheKey);

                //if (!string.IsNullOrEmpty(cached))
                //{
                //    var cachedTasks = JsonSerializer.Deserialize<List<TaskItem>>(cached);
                //    return Ok(cachedTasks);
                //}

                var tasks = await _taskService.GetAllTasks();

                //var json = JsonSerializer.Serialize(tasks);
                //var options = new DistributedCacheEntryOptions
                //{
                //    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
                //};
                //_logger.LogInformation("Задачи успешно получены");
                //await _cache.SetStringAsync(cacheKey, json, options);

                return Ok(tasks);
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
            
        }

        /// <summary>
        /// Получаем все задачи (с кешированием)
        /// </summary>
        /// <returns>Список задач</returns>
        [HttpGet("myTasks/{id}")]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetMyTasks(Guid id)
        {
            try
            {
                //const string cacheKey = "all_tasks";
                //var cached = await _cache.GetStringAsync(cacheKey);

                //if (!string.IsNullOrEmpty(cached))
                //{
                //    var cachedTasks = JsonSerializer.Deserialize<List<TaskItem>>(cached);
                //    return Ok(cachedTasks);
                //}

                var tasks = await _taskService.GetTasksByUser(id);

                //var json = JsonSerializer.Serialize(tasks);
                //var options = new DistributedCacheEntryOptions
                //{
                //    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
                //};
                //_logger.LogInformation("Задачи успешно получены");
                //await _cache.SetStringAsync(cacheKey, json, options);

                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }

        }


        /// <summary>
        /// Получаем задачи по ИД
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<TaskDtos>>> GetTaskById(Guid id)
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
            var user = await _userService.GetUserByIdAsync(taskDto.UserId);
            if (user == null)
                return BadRequest("Пользователь не найден");
            
            taskDto.UserId = user.Id;

            try
            {
                await _taskService.CreateTaskAsync(taskDto);

                _logger.LogInformation($"/api/task/create: Задача успешно создана пользователем {user.Name}");
                var notification = new Notification
                {
                    UserId = taskDto.PerformerId, // кому назначена задача
                    Message = $"🆕 Новая задача: {taskDto.Title}"
                };

                // SignalR
                var connId = NotificationHub.GetConnectionId(taskDto.PerformerId);
                if (connId != null)
                {
                    await _kafkaProducer.SendNotificationAsync(notification);
                    await _hubContext.Clients.Client(connId).SendAsync("ReceiveNotification", notification.Message);
                    await _notificationRepository.AddAsync(notification);

                }
                return Ok(new { message = "Задача успешно создана!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Ошибка сервера", error = ex.Message });
            }
        }

        [HttpPost("worklog")]
        public async Task<IActionResult> AddWorkLog([FromBody] WorkLogDto dto)
        {
            await _workLogService.AddWorkLogAsync(dto);
            return Ok();
        }

        /// <summary>
        /// Обновление задачи (изменяются только переданные поля)
        /// </summary>
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateTask(Guid id, [FromBody] UpdateTaskDto updateTaskDto)
        {
            if (id != updateTaskDto.Id)
                return BadRequest("Task ID mismatch.");

            var result = await _taskService.UpdateTaskAsync(id, updateTaskDto);
            if (!result)
                return NotFound("Задача не найдена или данные не изменились");

            return NoContent();
        }

        [HttpGet("priorities")]
        public async Task<IActionResult> GetPriorities()
        {
            var priorities = Enum.GetValues(typeof(TaskManager.Domain.Enums.TaskPriority))
                                 .Cast<TaskManager.Domain.Enums.TaskPriority>()
                                 .Select(p => new PriorityModel
                                 {
                                     ID = ((int)p).ToString(),
                                     Description = p.ToString()
                                 })
                                 .ToList();

            return Ok(priorities);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategory()
        {
            var categorys = await _taskService.GetAllCategory();
            var categoryModel = categorys.Select(p => new CategoryModel
            {
                ID = p.Id.ToString(),
                Name = p.Name
            }).ToList();
            return Ok(categoryModel);
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
    

    public class PriorityModel
    {
        public string ID { get; set; }
        public string Description { get; set; } = string.Empty;
    }
    public class CategoryModel
    {
        public string ID { get; set; }
        public string Name { get; set; } = string.Empty;
    }
    public class CreateTaskModel
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid ProjectId { get; set; }
        public TaskManager.Domain.Enums.TaskPriority Priority { get; set; }
    }
}
