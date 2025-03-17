import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './TaskList.css'; // Подключаем CSS
import { AuthContext } from "../context/AuthContext";
import viewIcon from '../Icons/view.png';
import editIcon from '../Icons/Edit.png';
import deleteIcon from '../Icons/Delete.png';

// Интерфейсы
interface TaskItem {
    id: string;
    title: string;
    description: string;
    projectName: string;
    status: number;
    priority: number;
    userName: string;
    userId: string;
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

const API_BASE_URL = "http://192.168.22.53:5213";


const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
    const [createTask, getCreateTask] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 9;

    // Фильтры
    const [filterUser, setFilterUser] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [filterProject, setFilterProject] = useState("");
    const [filterTitle, setFilterTitle] = useState("");

    // Данные для фильтров
    const auth = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [projectId, setProjectId] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);


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
    // Создание задачи
    const handleCreateTask = async () => {
        if (!title.trim() || !description.trim() || !projectId) {
            alert("Заполните все поля!");
            return;
        }

        if (!auth?.user?.id) {
            alert("Ошибка: не удалось определить пользователя.");
            return;
        }

        // Переводим статус и приоритет в Enum
        const statusEnum = 0; // TaskStatus.New = 0
        const priorityEnum = priority === "Low" ? 0 : priority === "Medium" ? 1 : 2; // Enum TaskPriority

        const requestBody = {
            title,
            description,
            priority: priorityEnum,
            projectId,
            status: statusEnum,
            userId: auth.user.id
        };

        console.log("Отправляемые данные:", requestBody);

        try {
            await axios.post(
                "https://localhost:7121/api/task/create",
                requestBody,
                { headers: { Authorization: `Bearer ${auth?.token}` } }
            );
            closeTaskCreate();
            gettasks();
            alert("Задача успешно создана!");
        } catch (error) {
            console.error("Ошибка при создании задачи:", error);
            alert("Не достаточно прав.");
        }
    };

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
            closeTaskDetails();
            gettasks();
        } catch (error) {
            console.error("Ошибка при удалении задачи:", error);
            alert("Не удалось удалить задачу.");
        }
    };


    // Функции для получения текстов
    const getStatusText = (status: number): string => ["Новая", "В процессе", "Завершена"][status] || "Неизвестно";
    const getPriorityText = (priority: number): string => ["Низкий", "Средний", "Высокий"][priority] || "Неизвестно";

    // Функция для открытия модального окна с детальным описанием
    const openTaskDetails = (task: TaskItem) => {
        setSelectedTask(task);
    };

    // Функция для закрытия модального окна
    const closeTaskDetails = () => {
        setSelectedTask(null);
    };

    // Функция для открытия модального окна создания задачи
    const openTaskCreate = () => getCreateTask(true);
    const closeTaskCreate = () => getCreateTask(false);

    // Пагинация
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
/*    let imageClassName = "images";*/

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
                                        <div className="images"><img onClick={() => openTaskDetails(task)} src={viewIcon} alt="Просмотр" /></div>
                                        {/*{auth?.user?.id != task.userId ? imageClassName = "images" : imageClassName = "imagesDisabled"}*/}
                                        <div className="images">
                                            <img src={editIcon} alt="Редактировать" />
                                        </div>
                                        {/*{auth?.user?.id != task.userID && <div className="images disalbled"><img src="./src/Icons/Edit.png" /></div>}*/}
                                        {/*{auth?.user?.id == task.userId &&*/} <div className="images"><img onClick={() => handleDeleteTask(task.id)} src={deleteIcon} alt="Удалить" /></div>
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

            {selectedTask && (
                <div className="modal-overlay" onClick={closeTaskDetails}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedTask.title}</h2>
                        <p ><strong>Описание:</strong> {selectedTask.description}</p>
                        <p><strong>Проект ID:</strong> {selectedTask.projectName}</p>
                        <p><strong>Статус:</strong> {getStatusText(selectedTask.status)}</p>
                        <p><strong>Приоритет:</strong> {getPriorityText(selectedTask.priority)}</p>
                        <p><strong>Ответственный пользователь:</strong> {selectedTask.userName}</p>
                        {/*{selectedTask.workLogs && selectedTask.workLogs.length > 0 && (*/}
                        {/*    <>*/}
                        {/*        <h3>Логи работы:</h3>*/}
                        {/*        <ul>*/}
                        {/*            {selectedTask.workLogs.map((log, index) => (*/}
                        {/*                <li key={index}>{JSON.stringify(log)}</li>*/}
                        {/*            ))}*/}
                        {/*        </ul>*/}
                        {/*    </>*/}
                        {/*)}*/}
                        <div className = "divbutton">
                            <button onClick={closeTaskDetails} className="buttonstyle">Закрыть</button>
                            <button key={selectedTask.id} onClick={() => handleDeleteTask(selectedTask.id)} className="buttonstyle">Удалить</button>
                        </div>
                    </div>
                </div>
            )}

            {createTask && (
                <div className="modal-overlay" onClick={closeTaskCreate}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="create-task-container">
                            <h2>Создать задачу</h2>
                            <div className="createTask">
                                <input className="inputstyle"
                                    type="text"
                                    placeholder="Название задачи"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="createTask">
                                <textarea
                                    placeholder="Описание задачи"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="createTask">
                                <p>Приоритет:  </p>
                                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                    <option value="Low">Низкий</option>
                                    <option value="Medium">Средний</option>
                                    <option value="High">Высокий</option>
                                </select>
                            </div>
                            <div className="createTask">
                                <p>Проект:</p>
                                <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                                    <option value="">Выберите проект</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>{project.description}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="divbuttons">
                                <div className="divbuttons">
                                    <button onClick={handleCreateTask} className="buttonstyle" >Создать задачу</button>
                                </div>
                                <div className="divbuttons">
                                    <button onClick={closeTaskCreate} className="close-button buttonstyle">Закрыть</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default TaskList;
