using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Interfaces;
using TaskManager.Server.Models;

namespace TaskManager.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;
        public TaskController(ITaskService taskService) 
        {
            _taskService = taskService;
        }
        // Статический список задач для примера
        //private static List<TaskItem> tasks = new List<TaskItem>
        //{
        //    new TaskItem { Id = Guid.NewGuid(), Title = "Task 1", Description = "Description 1", IsCompleted = false },
        //    new TaskItem { Id = Guid.NewGuid(), Title = "Task 2", Description = "Description 2", IsCompleted = true }
        //};

        // Получить все задачи
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
        {
            var tasks = await _taskService.GetAllTasks();
            return Ok(tasks);
        }

        // Получить задачу по Id
        [HttpGet("{id}")]
        public ActionResult<TaskItem> GetTaskById(Guid id)
        {
            //var task = tasks.FirstOrDefault(t => t.Id == id);
            //if (task == null)
            //    return NotFound();

            return Ok();
        }
    }
}
