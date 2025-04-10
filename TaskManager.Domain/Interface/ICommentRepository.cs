using TaskManager.Domain.Entities;

namespace TaskManager.Domain.Interface
{
    public interface ICommentRepository
    {
        Task<IEnumerable<Comment>> GetCommentsByTaskIdAsync(Guid taskId);
        Task AddCommentAsync(Comment comment);
        Task DeleteCommentAsync(Guid commentId);
    }
}
