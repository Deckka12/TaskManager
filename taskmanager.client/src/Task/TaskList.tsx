// отредактированная версия TaskList с улучшенным стилем
// вся логика и структура сохранены, только улучшен внешний вид

// импорт библиотек и компонентов
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './TaskList.css';
import { AuthContext } from '../context/AuthContext';
import TaskDetails from './TaskDetails/TaskDetails';
import CreateTask from './CreateTask';
import EditTask from './EditTask';
import API_BASE_URL from '../config';

import viewIcon from '../Icons/view.png';
import editIcon from '../Icons/Edit.png';
import deleteIcon from '../Icons/Delete.png';

import log from 'loglevel';

interface TaskItem {
    id: string;
    title: string;
    description: string;
    projectName: string;
    projectId: string;
    status: number;
    priority: number;
    userName: string;
    userId: string;
    categoryID: string;
    dueDate: Date;
}

interface User {
    id: string;
    name: string;
}

interface Project {
    id: string;
    name: string;
    description: string;
}

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [createTask, getCreateTask] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 15;
    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
    const [filterUser, setFilterUser] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [filterProject, setFilterProject] = useState('');
    const [filterTitle, setFilterTitle] = useState('');

    const auth = useContext(AuthContext);
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        axios.get<TaskItem[]>(`${API_BASE_URL}/api/task/myTasks/${auth?.user?.id}`)
            .then(response => {
                setTasks(response.data);
                setFilteredTasks(response.data);
                setLoading(false);
                log.info("Задачи загружены");
            })
            .catch(error => {
                console.error('Ошибка при загрузке задач:', error);
                setLoading(false);
            });

        axios.get<User[]>(`${API_BASE_URL}/api/task/users`)
            .then(response => setUsers(response.data))
            .catch(error => console.error('Ошибка при загрузке пользователей:', error));

        axios.get<Project[]>(`${API_BASE_URL}/api/project/project`)
            .then(response => setProjects(response.data))
            .catch(error => console.error('Ошибка при загрузке проектов:', error));
    }, []);

    useEffect(() => {
        let filtered = tasks;
        if (filterUser) filtered = filtered.filter(task => task.userName === filterUser);
        if (filterPriority !== '') filtered = filtered.filter(task => task.priority === Number(filterPriority));
        if (filterProject) filtered = filtered.filter(task => task.projectName === filterProject);
        if (filterTitle.trim() !== '') filtered = filtered.filter(task => task.title.toLowerCase().includes(filterTitle.toLowerCase()));

        setFilteredTasks(filtered);
        setCurrentPage(1);
    }, [filterUser, filterPriority, filterProject, filterTitle, tasks]);

    const gettasks = async () => {
        const response = await axios.get<TaskItem[]>(`${API_BASE_URL}/api/task`);
        setFilteredTasks(response.data);
        setLoading(false);
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!auth?.user?.id) return alert("Ошибка: не удалось определить пользователя.");

        try {
            await axios.post(`${API_BASE_URL}/api/task/delete`, { id: taskId }, {
                headers: { Authorization: `Bearer ${auth?.token}` }
            });
            alert("Задача удалена");
            closeTaskDetailss();
            gettasks();
        } catch (error) {
            console.error("Ошибка при удалении задачи:", error);
            alert("Не удалось удалить задачу.");
        }
    };

    const reloadTasks = async () => {
        const response = await axios.get<TaskItem[]>(`${API_BASE_URL}/api/task`);
        setTasks(response.data);
        setFilteredTasks(response.data);
    };

    const getStatusText = (status: number): string => ["Новая", "В процессе", "Завершена"][status] || "Неизвестно";
    const getPriorityText = (priority: number): string => ["Низкий", "Средний", "Высокий"][priority] || "Неизвестно";

    const openTaskDetailss = (taskId: string) => setSelectedTaskId(taskId);
    const openTaskEdit = (task: TaskItem) => setSelectedTask(task);
    const closeTaskDetailss = () => setSelectedTaskId(null);
    const openTaskCreate = () => getCreateTask(true);
    const closeTaskCreate = () => getCreateTask(false);

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    return (
        <div className="task-container">
            <h1 className="title">Список задач</h1>

            <div className="filters">
                <input type="text" placeholder="Поиск по названию" value={filterTitle} onChange={(e) => setFilterTitle(e.target.value)} />
                <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
                    <option value="">Все пользователи</option>
                    {users.map(user => <option key={user.id} value={user.name}>{user.name}</option>)}
                </select>
                <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
                    <option value="">Все проекты</option>
                    {projects.map(project => <option key={project.id} value={project.name}>{project.description}</option>)}
                </select>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="">Все приоритеты</option>
                    <option value="0">Низкий</option>
                    <option value="1">Средний</option>
                    <option value="2">Высокий</option>
                </select>
                {auth?.user && <button className="buttonstyle" onClick={openTaskCreate}>Создать</button>}
            </div>

            {loading ? (
                <p className="loading-text">Загрузка задач...</p>
            ) : currentTasks.length === 0 ? (
                <p className="no-tasks">Нет задач</p>
            ) : (
                <>
                    <div className="task-list">
                        {currentTasks.map(task => (
                            <div key={task.id} className={`task-card ${task.priority === 0 ? "priority-low" : task.priority === 1 ? "priority-medium" : "priority-high"}`}>
                                <h3 className="hidetext">{task.title}</h3>
                                <p className="hidetext">{task.description}</p>
                                <p><strong>Статус:</strong> {getStatusText(task.status)}</p>
                                <p><strong>Приоритет:</strong> {getPriorityText(task.priority)}</p>
                                <div className="buttonImg">
                                    <div className="images"><img onClick={() => openTaskDetailss(task.id)} src={viewIcon} alt="Просмотр" /></div>
                                    <div className="images"><img src={editIcon} onClick={() => openTaskEdit(task)} alt="Редактировать" /></div>
                                    {auth?.user?.id === task.userId && (
                                        <div className="images"><img onClick={() => handleDeleteTask(task.id)} src={deleteIcon} alt="Удалить" /></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button className="buttonstyle" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Назад</button>
                        <span>Страница {currentPage} из {totalPages}</span>
                        <button className="buttonstyle" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Вперёд</button>
                    </div>
                </>
            )}

            {selectedTaskId && <TaskDetails taskId={selectedTaskId} onClose={closeTaskDetailss} />}
            {createTask && <CreateTask onClose={closeTaskCreate} getTask={gettasks} />}
            {selectedTask && (
                <EditTask
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onTaskUpdated={reloadTasks}
                />
            )}
        </div>
    );
};

export default TaskList;
