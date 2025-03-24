using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;

namespace TaskManager.Server.Controllers
{
    [ApiController]
    [Route("api/task/files")]
    public class TaskFileController : ControllerBase
    {
        private readonly ITaskFileService _taskFileService;

        public TaskFileController(ITaskFileService taskFileService)
        {
            _taskFileService = taskFileService;
        }

        /// <summary>
        /// Загрузка файла в задачу
        /// </summary>
        [HttpPost("upload/{taskId}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadFile(Guid taskId, [FromForm] FileUploadDto model)
        {
            var file = model.File;

            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Файл не выбран" });

            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);

            bool success = await _taskFileService.UploadFileAsync(taskId, file.FileName, ms.ToArray(), file.ContentType);
            if (!success)
                return NotFound(new { message = "Задача не найдена" });

            return Ok(new { message = "Файл успешно загружен!" });
        }


        /// <summary>
        /// Получение списка файлов для задачи
        /// </summary>
        [HttpGet("{taskId}")]
        public async Task<IActionResult> GetTaskFiles(Guid taskId)
        {
            var files = await _taskFileService.GetTaskFilesAsync(taskId);
            return Ok(files.Select(f => new { f.Id, f.FileName }));
        }

        /// <summary>
        /// Скачивание файла
        /// </summary>
        [HttpGet("download/{fileId}")]
        public async Task<IActionResult> DownloadFile(int fileId)
        {
            var file = await _taskFileService.GetFileByIdAsync(fileId);
            if (file == null)
                return NotFound();

            return File(file.Data, file.ContentType, file.FileName);
        }

        /// <summary>
        /// Удаление файла
        /// </summary>
        [HttpDelete("delete/{fileId}")]
        public async Task<IActionResult> DeleteFile(int fileId)
        {
            bool success = await _taskFileService.DeleteFileAsync(fileId);
            if (!success)
                return NotFound(new { message = "Файл не найден" });

            return Ok(new { message = "Файл успешно удален" });
        }
    }
}
