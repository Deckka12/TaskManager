using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Interfaces;

namespace TaskManager.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkTypeController : ControllerBase
    {
        private readonly IWorkTypeService _workTypeService;

        public WorkTypeController(IWorkTypeService workTypeService)
        {
            _workTypeService = workTypeService;
        }

        // GET: /api/worktype
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _workTypeService.GetAllAsync();
            return Ok(result);
        }

        // POST: /api/worktype
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] string name)
        {
            var success = await _workTypeService.CreateAsync(name);
            if (!success)
                return Conflict("Такой тип уже существует");

            return Ok(new { message = "Тип работы добавлен" });
        }

        // DELETE: /api/worktype/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _workTypeService.DeleteAsync(id);
            if (!success)
                return BadRequest("Нельзя удалить тип работы: он используется или не найден");

            return NoContent();
        }
    }
}
