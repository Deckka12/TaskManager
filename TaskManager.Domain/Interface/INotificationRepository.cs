using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;

namespace TaskManager.Domain.Interface
{
    public interface INotificationRepository
    {
        Task AddAsync(Notification notification);
        Task<List<Notification>> GetUnreadByUserAsync(Guid userId);
        Task<List<Notification>> GetAllByUserAsync(Guid userId);
        Task MarkAsReadAsync(Guid notificationId);
    }

}
