// IWorkTypeService.cs
using TaskManager.Domain.Entities;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Interface;

namespace TaskManager.Application.Services
{
    public class WorkTypeService : IWorkTypeService
    {
        private readonly IWorkTypeRepository _repository;

        public WorkTypeService(IWorkTypeRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<WorkType>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<WorkType?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<bool> CreateAsync(string name)
        {
            if (await _repository.ExistsByNameAsync(name)) return false;

            var workType = new WorkType
            {
                Id = Guid.NewGuid(),
                Name = name
            };

            await _repository.AddAsync(workType);
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (await _repository.IsUsedInWorkLogsAsync(id)) return false;
            return await _repository.DeleteAsync(id);
        }
    }
}
