using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;
using TaskManager.Application.Interface;
using TaskManager.Domain.Interface;
using TaskManager.Application.DTOs;

namespace TaskManager.Application.Services
{
    public class WorkLogService : IWorkLogService
    {
        private readonly IWorkLogRepository _workLogRepository;

        public WorkLogService(IWorkLogRepository workLogRepository)
        {
            _workLogRepository = workLogRepository;
        }

        public async Task AddWorkLogAsync(WorkLogDto workLogDto)
        {
            var workLog = new WorkLog
            {
                TaskId = workLogDto.TaskId,
                UserId = workLogDto.UserId,
                HoursSpent = workLogDto.HoursSpent,
                WorkType = workLogDto.WorkType,
                Comment = workLogDto.Comment,
                Date = DateTime.UtcNow
            };

            await _workLogRepository.AddAsync(workLog);
        }

        public async Task<List<WorkLog>> GetWorkLogsAsync(Guid taskId)
        {
            return await _workLogRepository.GetByTaskIdAsync(taskId);
        }

        public async Task<double> GetTotalHoursAsync(Guid taskId)
        {
            return await _workLogRepository.GetTotalHoursAsync(taskId);
        }
    }

}
