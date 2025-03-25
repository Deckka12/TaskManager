import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProjectDetails.css';
import API_BASE_URL from '../config';

interface TaskItem {
    id: string;
    title: string;
    description: string;
    status: number;
    priority: number;
    userName: string;
}

interface ProjectDetailsData {
    id: string;
    name: string;
    description: string;
    ownerId: string;
}

const getStatusText = (status: number) => ["Новая", "В процессе", "Завершена"][status] || "Неизвестно";
const getPriorityText = (priority: number) => ["Низкий", "Средний", "Высокий"][priority] || "Неизвестно";

const ProjectDetails: React.FC = () => {
    const { id } = useParams();
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [project, setProject] = useState<ProjectDetailsData | null>(null);

    useEffect(() => {
        if (id) {
            axios.get(`${API_BASE_URL}/api/task/by-project/${id}`)
                .then(res => setTasks(res.data))
                .catch(err => console.error('Ошибка загрузки задач проекта:', err));

            axios.get(`${API_BASE_URL}/api/task/project/${id}`)
                .then(res => setProject(res.data))
                .catch(err => console.error('Ошибка загрузки проекта:', err));
        }
    }, [id]);

    return (
        <div className="project-details-layout">
            <div className="project-tasks">
                <h2>Задачи проекта</h2>
                {tasks.length === 0 ? <p>Нет задач.</p> : (
                    <div className="task-list">
                        {tasks.map(task => (
                            <div key={task.id} className="task-card">
                                <h4>{task.title}</h4>
                                <p>{task.description}</p>
                                <p><strong>Статус:</strong> {getStatusText(task.status)}</p>
                                <p><strong>Приоритет:</strong> {getPriorityText(task.priority)}</p>
                                <p><strong>Исполнитель:</strong> {task.userName}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="project-sidebar">
                <h3>О проекте</h3>
                {project ? (
                    <>
                        <p><strong>Название:</strong> {project.name}</p>
                        <p><strong>Описание:</strong> {project.description}</p>
                        <p><strong>Владелец:</strong> {project.ownerId}</p>
                    </>
                ) : <p>Загрузка...</p>}
            </div>
        </div>
    );
};

export default ProjectDetails;
