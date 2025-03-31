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

interface ProjectUserRole {
    userId: string;
    userName: string;
    roleId: string;
    roleName: string;
}
interface ProjectDetailsData {
    id: string;
    name: string;
    description: string;
    ownerName: string;
    userId: string;
    userRoles: ProjectUserRole[];
}

const getStatusText = (status: number) => ["Новая", "В процессе", "Завершена"][status] || "Неизвестно";
const getPriorityText = (priority: number) => ["Низкий", "Средний", "Высокий"][priority] || "Неизвестно";

const ProjectDetails: React.FC = () => {
    const { id } = useParams();
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [project, setProject] = useState<ProjectDetailsData | null>(null);
    const [filteredTasks, setFilteredTasks] = useState<TaskItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 15;

    useEffect(() => {
        if (id) {
            axios.get(`${API_BASE_URL}/api/project/projectID/${id}`)
                .then(res => {
                    setTasks(res.data);
                    setFilteredTasks(res.data);
                }
                )
                .catch(err => console.error('Ошибка загрузки задач проекта:', err));

            axios.get(`${API_BASE_URL}/api/project/${id}`)
                .then(res => setProject(res.data))
                .catch(err => console.error('Ошибка загрузки проекта:', err));
        }
    }, [id]);

    // Пагинация
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    return (
        <div className="project-details-layout">
            <div className="project-tasks">
                <h2>Задачи проекта</h2>
                {tasks.length === 0 ? <p>Нет задач.</p> : (
                    <>
                        <div className="task-list">
                            {currentTasks.map(task => (
                                <div key={task.id} className="task-card">
                                    <h4>{task.title}</h4>
                                    <p>{task.description}</p>
                                    <p><strong>Статус:</strong> {getStatusText(task.status)}</p>
                                    <p><strong>Приоритет:</strong> {getPriorityText(task.priority)}</p>
                                    <p><strong>Исполнитель:</strong> {task.userName}</p>
                                </div>
                            ))}
                        </div>
                        <div className="pagination">
                            <button className="buttonstyle" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                                Назад
                            </button>
                            <span>Страница {currentPage} из {totalPages}</span>
                            <button className="buttonstyle" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                                Вперёд
                            </button>
                        </div>
                    </>
                )}

            </div>

            <div className="project-sidebar">
                <h3>О проекте</h3>
                {project ? (
                    <>
                        <p><strong>Название:</strong> {project.name}</p>
                        <p><strong>Описание:</strong> {project.description}</p>
                        <p><strong>Ответственный: </strong> {project.ownerName}</p>
                        {project.userRoles && project.userRoles.length > 0 && (
                            <div style={{ marginTop: '15px', textAlign: 'left' }}>
                                <strong>Участники:</strong>
                                <br></br>
                                {Object.entries(
                                    project.userRoles.reduce((acc, curr) => {
                                        if (!acc[curr.roleName]) acc[curr.roleName] = [];
                                        acc[curr.roleName].push(curr.userName);
                                        return acc;
                                    }, {} as Record<string, string[]>)
                                ).map(([roleName, users], index) => (
                                    <p key={index} style={{ margin: '6px 0' }}>
                                        <strong>{roleName}:</strong> {users.join(', ')}
                                    </p>
                                ))}
                            </div>
                        )}
                    </>
                ) : <p>Загрузка...</p>}
            </div>
        </div>
    );
};

export default ProjectDetails;
