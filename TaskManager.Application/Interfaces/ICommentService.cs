using TaskManager.Application.DTOs;

namespace TaskManager.Application.Interfaces
{
    public interface ICommentService
    {
        Task<IEnumerable<CommentDto>> GetCommentsByTaskIdAsync(Guid taskId);
        Task AddCommentAsync(CommentDto dto);
        Task DeleteCommentAsync(Guid id);
    }
}
