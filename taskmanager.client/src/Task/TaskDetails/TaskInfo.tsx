import React from 'react';
import { TaskItem } from './types';

interface Props {
    task: TaskItem;
}

const TaskInfo: React.FC<Props> = ({ task }) => (
    <div className="task-info">
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <p><strong>Проект:</strong> {task.projectName}</p>
        <p><strong>Статус:</strong> {task.status}</p>
        <p><strong>Приоритет:</strong> {task.priority}</p>
        <p><strong>Ответственный:</strong> {task.userName}</p>
    </div>
);

export default TaskInfo;