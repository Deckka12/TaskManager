import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TaskList.css'; // Подключаем CSS

// Интерфейс TaskItem
interface TaskItem {
    id: string;
    title: string;
    description: string;
    projectName: string;
    status: number;
    priority: number;
    userName: string;
}

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

    useEffect(() => {
        axios.get<TaskItem[]>('http://localhost:5213/api/task')
            .then(response => {
                setTasks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Ошибка при загрузке задач:', error);
                setLoading(false);
            });
    }, []);

    // Функция для получения текстового статуса
    const getStatusText = (status: number): string => {
        switch (status) {
            case 0:
                return 'Новая';
            case 1:
                return 'В процессе';
            case 2:
                return 'Завершена';
            default:
                return 'Неизвестно';
        }
    };

    // Функция для получения текстового статуса
    const getPriorityText = (status: number): string => {
        switch (status) {
            case 0:
                return 'Низкий';
            case 1:
                return 'Средний';
            case 2:
                return 'Высокий';
            default:
                return 'Неизвестно';
        }
    };

    // Функция для открытия модального окна с детальным описанием
    const openTaskDetails = (task: TaskItem) => {
        setSelectedTask(task);
    };

    // Функция для закрытия модального окна
    const closeTaskDetails = () => {
        setSelectedTask(null);
    };

    return (
        <div className="task-container">
            <h1 className="title">Список задач</h1>

            {loading ? <p className="loading-text">Загрузка задач...</p> : (
                tasks.length === 0 ? (
                    <p className="no-tasks">Нет задач.</p>
                ) : (
                    <div className="task-list">
                        {tasks.map(task => (
                            <div
                                key={task.id}
                                className={`task-card`}
                                onClick={() => openTaskDetails(task)}
                            >
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <p><strong>Статус:</strong> {getStatusText(task.status)}</p>
                                <p><strong>Приоритет:</strong> {getPriorityText(task.priority)}</p>
                            </div>
                        ))}
                    </div>
                )
            )}

            {/* Модальное окно с детальной информацией */}
            {selectedTask && (
                <div className="modal-overlay" onClick={closeTaskDetails}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedTask.title}</h2>
                        <p><strong>Описание:</strong> {selectedTask.description}</p>
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
                        <button onClick={closeTaskDetails} className="close-button">Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskList;
