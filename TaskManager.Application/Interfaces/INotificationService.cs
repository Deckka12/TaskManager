using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Interfaces
{
    public interface INotificationService
    {
        Task SaveNotificationAsync(Guid userId, string message);
        Task<List<Notification>> GetAllByUserAsync(Guid userId);

        public Task MarkAsReadAsync(Guid id);
    }
}
