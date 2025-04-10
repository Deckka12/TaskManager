import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchComments, addComment } from './api';
import { CommentDto } from './types';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface CommentsProps {
    taskId: string;
}

const Comments: React.FC<CommentsProps> = ({ taskId }) => {
    const auth = useContext(AuthContext);
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [text, setText] = useState('');

    const loadComments = async () => {
        try {
            const res = await fetchComments(taskId);
            setComments(res.data);
        } catch (error) {
            console.error("Ошибка при загрузке комментариев", error);
        }
    };

    const handleAddComment = async () => {
        if (!text.trim() || !auth?.token || !auth.user) return;

        try {
            await addComment({
                taskId,
                userId: auth.user.id,
                text
            }, auth.token);

            setText('');
            loadComments();
        } catch (error) {
            console.error("Ошибка при добавлении комментария", error);
        }
    };

    useEffect(() => {
        loadComments();
    }, [taskId]);

    return (
        <div className="comments-section">
            <div className="comments-list">
                {comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                        <div className="comment-meta">
                            <strong>{comment.userName}</strong> •{' '}
                            {formatDistanceToNow(new Date(comment.createdAt), {
                                addSuffix: true,
                                locale: ru
                            })}
                        </div>
                        <div className="comment-text">{comment.text}</div>
                    </div>
                ))}
            </div>

            {auth?.user && (
                <div className="comment-form">
                    <textarea
                        placeholder="Добавить комментарий..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button className="button primary" onClick={handleAddComment}>
                        Отправить
                    </button>
                </div>
            )}
        </div>
    );
};

export default Comments;
