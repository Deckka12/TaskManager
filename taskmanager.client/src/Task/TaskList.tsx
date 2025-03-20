import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './TaskList.css'; // Подключаем CSS
import { AuthContext } from "../context/AuthContext";
import TaskDetails from "./TaskDetails"; // Импортируем TaskDetails
import CreateTask from "./CreateTask"; // Импортируем CreateTask
import EditTask from "./EditTask";
import API_BASE_URL from "../config";

import viewIcon from '../Icons/view.png';
import editIcon from '../Icons/Edit.png';
import deleteIcon from '../Icons/Delete.png';

// Интерфейсы
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
//interface Category {
//    id: string;
//    name: string;
//}


const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null); // Теперь используем ID задачи
    const [createTask, getCreateTask] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 9;
    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
    // Фильтры
    const [filterUser, setFilterUser] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [filterProject, setFilterProject] = useState("");
    const [filterTitle, setFilterTitle] = useState("");

    // Данные для фильтров
    const auth = useContext(AuthContext);

    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    //const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        // Загружаем задачи
        axios.get<TaskItem[]>(`${API_BASE_URL}/api/task`)
            .then(response => {
                setTasks(response.data);
                setFilteredTasks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Ошибка при загрузке задач:', error);
                setLoading(false);
            });

        // Загружаем пользователей
        axios.get<User[]>(`${API_BASE_URL}/api/task/users`)
            .then(response => setUsers(response.data))
            .catch(error => console.error('Ошибка при загрузке пользователей:', error));

        // Загружаем проекты
        axios.get<Project[]>(`${API_BASE_URL}/api/task/project`)
            .then(response => setProjects(response.data))
            .catch(error => console.error('Ошибка при загрузке проектов:', error));

        //// Загружаем категории
        //axios.get<Category[]>(`${API_BASE_URL}/api/task/categories`)
        //    .then(response => setCategories(response.data))
        //    .catch(error => console.error('Ошибка при загрузке категорий:', error));
    }, []);
    // Фильтрация задач
    useEffect(() => {
        let filtered = tasks;

        if (filterUser) {
            filtered = filtered.filter(task => task.userName === filterUser);
        }
        if (filterPriority !== "") {
            filtered = filtered.filter(task => task.priority === Number(filterPriority));
        }
        if (filterProject) {
            filtered = filtered.filter(task => task.projectName === filterProject);
        }
        if (filterTitle.trim() !== "") {
            filtered = filtered.filter(task => task.title.toLowerCase().includes(filterTitle.toLowerCase()));
        }

        setFilteredTasks(filtered);
        setCurrentPage(1); // Сбрасываем страницу на первую
    }, [filterUser, filterPriority, filterProject, filterTitle, tasks]);

    //получение задач
    const gettasks = async () => {
        axios.get<TaskItem[]>(`${API_BASE_URL}/api/task`)
            .then(response => {
                setFilteredTasks(response.data);
                setLoading(false);
            })
    }
    const handleDeleteTask = async (taskId: string) => {
        if (!auth?.user?.id) {
            alert("Ошибка: не удалось определить пользователя.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/task/delete`, { id: taskId }, {
                headers: { Authorization: `Bearer ${auth?.token}` }
            });
            console.log("Ответ сервера:", response.data);
            alert("Задача успешно удалена!");
            closeTaskDetailss();
            gettasks();
        } catch (error) {
            console.error("Ошибка при удалении задачи:", error);
            alert("Не удалось удалить задачу.");
        }
    };

    const reloadTasks = async () => {
        try {
            const response = await axios.get<TaskItem[]>(`${API_BASE_URL}/api/task`);
            setTasks(response.data);
            setFilteredTasks(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке задач:", error);
        }
    };
    // Функции для получения текстов
    const getStatusText = (status: number): string => ["Новая", "В процессе", "Завершена"][status] || "Неизвестно";
    const getPriorityText = (priority: number): string => ["Низкий", "Средний", "Высокий"][priority] || "Неизвестно";

    // Открытие деталей задачи
    const openTaskDetailss = (taskId: string) => setSelectedTaskId(taskId);

    const openTaskEdit = (task: TaskItem) => {
        console.log("Редактируем задачу:", task);
        setSelectedTask(task);
    };

    // Закрытие деталей задачи
    const closeTaskDetailss = () => setSelectedTaskId(null); 

    // Функция для открытия модального окна создания задачи
    const openTaskCreate = () => getCreateTask(true);
    const closeTaskCreate = () => getCreateTask(false);

    // Пагинация
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    return (
        <div className="task-container">
            <h1 className="title">Список задач</h1>

            {/* Фильтры */}
            <div className="filters">
                <input type="text" placeholder="Фильтр по названию"
                    value={filterTitle} onChange={(e) => setFilterTitle(e.target.value)} />

                <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
                    <option value="">Все пользователи</option>
                    {users.map(user => (
                        <option key={user.id} value={user.name}>{user.name}</option>
                    ))}
                </select>

                <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
                    <option value="">Все проекты</option>
                    {projects.map(project => (
                        <option key={project.id} value={project.name}>{project.description}</option>
                    ))}
                </select>

                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="">Все приоритеты</option>
                    <option value="0">Низкий</option>
                    <option value="1">Средний</option>
                    <option value="2">Высокий</option>
                </select>
                {auth?.user && <button className="buttonstyle" onClick={openTaskCreate}>Создать</button>}
            </div>

            {loading ? <p className="loading-text">Загрузка задач...</p> : (
                currentTasks.length === 0 ? (
                    <p className="no-tasks">Нет задач.</p>
                ) : (
                    <>
                        <div className="task-list">

                            {currentTasks.map(task => (
                                <div key={task.id} className="task-card" /*onClick={() => openTaskDetails(task)}*/>
                                    <h3>{task.title}</h3>
                                    <p className="hidetext"> {task.description}</p>
                                    <p><strong>Статус:</strong> {getStatusText(task.status)}</p>
                                    <p><strong>Приоритет:</strong> {getPriorityText(task.priority)}</p>
                                    <div className="buttonImg">
                                        <div className="images"><img onClick={() => openTaskDetailss(task.id)} src={viewIcon} /></div>
                                        
                                        <div className="images">
                                            <img src={editIcon} onClick={() => openTaskEdit(task)} />
                                        </div>
                                        {auth?.user?.id == task.userId && <div className="images"><img onClick={() => handleDeleteTask(task.id)} src={deleteIcon} /></div>}
                                    </div>
                                </div>

                            ))}
                        </div>

                        {/* Пагинация */}
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
                )
            )}
            {selectedTaskId && <TaskDetails taskId={selectedTaskId} onClose={closeTaskDetailss} />}

            {createTask && <CreateTask onClose={closeTaskCreate} getTask={gettasks} />}
            {selectedTask && (
                <>
                    {console.log("Выбранная задача:", selectedTask)}  // ✅ Проверяем, что приходит в `selectedTask`
                    <EditTask
                        task={selectedTask}
                        onClose={() => setSelectedTask(null)}
                        onTaskUpdated={reloadTasks}
                    />
                </>
            )}

        </div>
    );
}

export default TaskList;
