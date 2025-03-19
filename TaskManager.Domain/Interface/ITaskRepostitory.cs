using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;

namespace TaskManager.Domain.Interface
{
    public interface ITaskRepository : IRepository<TaskItem>
    {
        Task<IEnumerable<TaskItem>> GetByUserIdAsync(Guid userId);
        Task DeleteAsync(Guid id);
        Task<TaskItem?> GetByIdWithWorkLogsAsync(Guid id);
        Task<IEnumerable<TaskItem>> GetByAllTask();
        Task<IEnumerable<Category>> GetAllCategory();
    }
}
