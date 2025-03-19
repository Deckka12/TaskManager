import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../config";
import deleteIcon from '../Icons/Delete.png';
interface TaskDetailsProps {
    taskId: string;
    onClose: () => void;
}

interface TaskItem {
    id: string;
    title: string;
    description: string;
    projectName: string;
    status: number;
    priority: number;
    userName: string;
}
interface FileItem {
    id: number;
    fileName: string;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId, onClose }) => {
    const [task, setTask] = useState<TaskItem | null>(null);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const auth = useContext(AuthContext);

    useEffect(() => {
        if (!auth?.token) {
            console.error("Ошибка: отсутствует токен авторизации");
            return;
        }

        fetchTaskDetails();
        fetchFiles();
    }, [taskId]);

    // Формируем заголовки запроса
    const getAuthHeaders = () => {
        if (!auth?.token) {
            console.error("Ошибка: Токен отсутствует!");
            return {};
        }
        return { Authorization: `Bearer ${auth.token}` };
    };

    const fetchTaskDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get<TaskItem>(`${API_BASE_URL}/api/task/${taskId}`, {
                headers: getAuthHeaders(),
            });

            if (response.data) {
                setTask(response.data);
            } else {
                console.error("Ошибка: API вернул пустой объект задачи");
            }
        } catch (error) {
            console.error("Ошибка загрузки задачи:", error);
        } finally {
            setLoading(false);
        }
    };

    // Загружаем файлы задачи
    const fetchFiles = async () => {
        try {
            const response = await axios.get<FileItem[]>(`${API_BASE_URL}/api/task/files/${taskId}`, {
                headers: getAuthHeaders(),
            });
            setFiles(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке файлов:", error);
        }
    };

    // Выбор файла
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    // Загрузка файла
    const handleUpload = async () => {
        if (!file) {
            alert("Выберите файл!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post(`${API_BASE_URL}/api/task/files/upload/${taskId}`, formData, {
                headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Файл загружен!");
            fetchFiles();
        } catch (error) {
            console.error("Ошибка загрузки файла:", error);
        }
    };

    // Удаление файла
    const handleDeleteFile = async (fileId: number) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/task/files/delete/${fileId}`, {
                headers: getAuthHeaders(),
            });

            alert("Файл удален!");
            fetchFiles();
        } catch (error) {
            console.error("Ошибка при удалении файла:", error);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {loading ? (
                    <p className="loading-text">Загрузка данных...</p>
                ) : task ? (
                    <>
                        <div className="task-details-container">
                            <h2 className="task-title">{task.title}</h2>
                            <div className="task-info">
                                <p><strong>Описание:</strong> {task.description}</p>
                                <p><strong>Проект:</strong> {task.projectName}</p>
                                <p><strong>Статус:</strong> {["Новая", "В процессе", "Завершена"][task.status]}</p>
                                <p><strong>Приоритет:</strong> {["Низкий", "Средний", "Высокий"][task.priority]}</p>
                                <p><strong>Ответственный:</strong> {task.userName}</p>
                            </div>

                            {/* Файлы */}
                            <h3>Файлы</h3>
                            <div className="file-upload">
                                <input type="file" onChange={handleFileChange} />
                                <button className="button primary" onClick={handleUpload}>Загрузить</button>
                            </div>

                            <ul className="file-list">
                                {files.length > 0 ? (
                                    files.map((file) => (
                                        <li key={file.id} className="file-item">
                                            <a
                                                href={`${API_BASE_URL}/api/task/files/download/${file.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="file-link"
                                            >
                                                {file.fileName}
                                            </a>
                                            <button className="delete-button" onClick={() => handleDeleteFile(file.id)}>
                                                <img src={deleteIcon} alt="Удалить" className="delete-icon" />
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <p className="no-files">Файлы отсутствуют.</p>
                                )}
                            </ul>

                            <div className="buttons">
                                <button onClick={onClose} className="button secondary">Закрыть</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="error-text">Ошибка загрузки задачи</p>
                )}
            </div>
        </div>
    );
};

export default TaskDetails;
