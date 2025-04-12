using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interface;

namespace TaskManager.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _repo;

        public NotificationService(INotificationRepository repo)
        {
            _repo = repo;
        }

        public async Task SaveNotificationAsync(Guid userId, string message)
        {
            var notification = new Notification
            {
                UserId = userId,
                Message = message
            };

            await _repo.AddAsync(notification);
        }

        public Task<List<Notification>> GetAllByUserAsync(Guid userId) =>
            _repo.GetAllByUserAsync(userId);

        public Task MarkAsReadAsync(Guid id) =>
            _repo.MarkAsReadAsync(id);
    }

}
