import React from 'react';
import { TaskItem } from './types';

interface Props {
    task: TaskItem;
}
const getStatusText = (status: number) => ["Новая", "В процессе", "Завершена"][status] || "Неизвестно";
const getPriorityText = (priority: number) => ["Низкий", "Средний", "Высокий"][priority] || "Неизвестно";
const TaskInfo: React.FC<Props> = ({ task }) => (
    <div className="task-info">
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <p><strong>Проект:</strong> {task.projectName}</p>
        <p><strong>Статус:</strong> {getStatusText(task.status)}</p>
        <p><strong>Приоритет:</strong> {getPriorityText(task.priority)}</p>
        <p><strong>Ответственный:</strong> {task.userName}</p>
    </div>
);

export default TaskInfo;