using TaskManager.Domain.Entities;

namespace TaskManager.Application.Interfaces
{
    public interface IWorkTypeService
    {
        Task<IEnumerable<WorkType>> GetAllAsync();
        Task<WorkType?> GetByIdAsync(Guid id);
        Task<bool> CreateAsync(string name);
        Task<bool> DeleteAsync(Guid id);
    }
}
