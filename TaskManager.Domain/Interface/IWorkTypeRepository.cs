using TaskManager.Domain.Entities;

namespace TaskManager.Domain.Interface
{
    public interface IWorkTypeRepository
    {
        Task<IEnumerable<WorkType>> GetAllAsync();
        Task<WorkType?> GetByIdAsync(Guid id);
        Task<bool> ExistsByNameAsync(string name);
        Task AddAsync(WorkType workType);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> IsUsedInWorkLogsAsync(Guid id);
    }
}
