import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TaskList.css'; // Подключаем CSS

interface TaskItem {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
}

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get<TaskItem[]>('http://localhost:5213/api/task')
            .then(response => {
                setTasks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="task-container">
            <h1 className="title">Список задач</h1>

            {loading ? <p className="loading-text">Загрузка задач...</p> : (
                tasks.length === 0 ? (
                    <p className="no-tasks">Нет задач.</p>
                ) : (
                    <div className="task-list">
                        {tasks.map(task => (
                            <div key={task.id} className={`task-card ${task.isCompleted ? 'completed' : ''}`}>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <p className="status">
                                    Статус: <span className={task.isCompleted ? 'status-completed' : 'status-pending'}>
                                        {task.isCompleted ? 'Completed' : 'В работе'}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}

export default TaskList;
