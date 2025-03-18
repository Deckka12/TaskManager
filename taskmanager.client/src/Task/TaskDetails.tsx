import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

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

const API_BASE_URL = "http://localhost:5213";

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId, onClose }) => {
    const [task, setTask] = useState<TaskItem | null>(null);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const auth = useContext(AuthContext); // Получаем токен авторизации

    // Проверяем, есть ли токен
    useEffect(() => {
        console.log("Текущий токен:", auth?.token);

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
        return {
            Authorization: `Bearer ${auth.token}`
        };
    };

    const fetchTaskDetails = async () => {
        try {
            console.log("Запрашиваем данные задачи...");

            const response = await axios.get<TaskItem>(`${API_BASE_URL}/api/task/${taskId}`, {
                headers: getAuthHeaders(),
            });

            console.log("Ответ от сервера:", response.data);

            if (response.data) {
                setTask(response.data);
            } else {
                console.error("Ошибка: API вернул пустой объект задачи");
            }
        } catch (error) {
            console.error("Ошибка загрузки задачи:", error);
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
                    "Content-Type": "multipart/form-data"
                }
            });

            alert("Файл загружен!");
            fetchFiles(); // Обновить список файлов
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
                {task ? (
                    <>
                        <h2>{task.title}</h2>
                        <p><strong>Описание:</strong> {task.description}</p>
                        <p><strong>Проект:</strong> {task.projectName}</p>
                        <p><strong>Статус:</strong> {["Новая", "В процессе", "Завершена"][task.status]}</p>
                        <p><strong>Приоритет:</strong> {["Низкий", "Средний", "Высокий"][task.priority]}</p>
                        <p><strong>Ответственный:</strong> {task.userName}</p>

                        {/* Файлы */}
                        <h3>Файлы</h3>
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={handleUpload}>Загрузить</button>

                        <ul>
                            {files.map((file) => (
                                <li key={file.id}>
                                    <a href={`${API_BASE_URL}/api/task/files/download/${file.id}`} target="_blank" rel="noopener noreferrer">
                                        {file.fileName}
                                    </a>
                                    <button onClick={() => handleDeleteFile(file.id)}>Удалить</button>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p>Загрузка...</p>
                )}

                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};

export default TaskDetails;
