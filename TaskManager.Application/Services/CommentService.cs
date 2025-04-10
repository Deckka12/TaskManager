using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Domain.Interface;

namespace TaskManager.Application.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _repo;

        public CommentService(ICommentRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<CommentDto>> GetCommentsByTaskIdAsync(Guid taskId)
        {
            var comments = await _repo.GetCommentsByTaskIdAsync(taskId);
            return comments.Select(c => new CommentDto
            {
                Id = c.Id,
                TaskId = c.TaskId,
                UserId = c.UserId,
                UserName = c.User.Name,
                Text = c.Text,
                CreatedAt = c.CreatedAt
            });
        }

        public async Task AddCommentAsync(CommentDto dto)
        {
            var comment = new Comment
            {
                TaskId = dto.TaskId,
                UserId = dto.UserId,
                Text = dto.Text,
                CreatedAt = DateTime.UtcNow
            };
            await _repo.AddCommentAsync(comment);
        }

        public async Task DeleteCommentAsync(Guid id)
        {
            await _repo.DeleteCommentAsync(id);
        }
    }
}
