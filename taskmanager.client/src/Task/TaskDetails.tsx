import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../config";
import deleteIcon from '../Icons/Delete.png';
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

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
    workLogs: TimeEntry[];
}

interface FileItem {
    id: number;
    fileName: string;
}

interface TimeEntry {
    id: string;
    userId?: string;
    userName?: string;
    date: Date;
    hoursSpent: number;
    workType: string;
    comment?: string;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId, onClose }) => {
    const [task, setTask] = useState<TaskItem | null>(null);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"details" | "time" | "comments">("details");
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [hoursSpent, setHoursSpent] = useState(0);
    const [workType, setWorkType] = useState("");
    const [comment, setComment] = useState("");

    const auth = useContext(AuthContext);

    useEffect(() => {
        if (!auth?.token) {
            console.error("Ошибка: отсутствует токен авторизации");
            return;
        }
        fetchTaskDetails();
        fetchFiles();
    }, [taskId]);

    const getAuthHeaders = () => {
        return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
    };

    const fetchTaskDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get<TaskItem>(`${API_BASE_URL}/api/task/${taskId}`, {
                headers: getAuthHeaders(),
            });
            if (response.data) {
                setTask(response.data);
                setTimeEntries(response.data.workLogs || []);
            }
        } catch (error) {
            console.error("Ошибка загрузки задачи:", error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

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

    const handleAddWorkLog = async () => {
        try {
            const requestBody = {
                taskId,
                userId: auth?.user?.id,
                userName: auth?.user?.id,
                hoursSpent,
                workType,
                comment,
            };
            await axios.post(`${API_BASE_URL}/api/task/worklog`, requestBody, {
                headers: getAuthHeaders(),
            });
            setShowTimeModal(false);
            setHoursSpent(0);
            setWorkType("");
            setComment("");
            fetchTaskDetails();
        } catch (error) {
            console.error("Ошибка при списании времени:", error);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="tabs">
                    <button onClick={() => setActiveTab("details")} className={activeTab === "details" ? "active" : ""}>Задача</button>
                    <button onClick={() => setActiveTab("time")} className={activeTab === "time" ? "active" : ""}>Трудозатраты</button>
                    <button onClick={() => setActiveTab("comments")} className={activeTab === "comments" ? "active" : ""}>Комментарии</button>
                </div>

                {loading ? (
                    <p className="loading-text">Загрузка данных...</p>
                ) : task ? (
                    <>
                        {activeTab === "details" && (
                            <div className="task-details-container">
                                <h2 className="task-title">{task.title}</h2>
                                <div className="task-info">
                                    <p><strong>Описание:</strong> {task.description}</p>
                                    <p><strong>Проект:</strong> {task.projectName}</p>
                                    <p><strong>Статус:</strong> {["Новая", "В процессе", "Завершена"][task.status]}</p>
                                    <p><strong>Приоритет:</strong> {["Низкий", "Средний", "Высокий"][task.priority]}</p>
                                    <p><strong>Ответственный:</strong> {task.userName}</p>
                                </div>
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
                            </div>
                        )}

                            {activeTab === "time" && (
                            <>
                            <div className="time-tracking">
                                <h3>Трудозатраты</h3>
                                
                                    <ul className="worklog-list">
                                        {timeEntries.map((entry) => (
                                            <li key={entry.id} className="worklog-item">
                                                <div className="worklog-meta">
                                                    <span className="meta-author">
                                                        Добавил(а) <strong>{entry.userName}</strong>{" "}
                                                        {entry.date ? `${formatDistanceToNow(new Date(entry.date).getTime() + new Date().getTimezoneOffset() * -60000, {
                                                            addSuffix: false,
                                                            locale: ru,
                                                        }) } назад` : ""}
                                                    </span>
                                                </div>
                                                <div className="worklog-details">
                                                    <span className="worklog-time">• Трудозатраты: {entry.hoursSpent.toFixed(2)} ч</span>
                                                    <br/>
                                                    <span className="worklog-time">• Тип работ: {entry.workType}</span>
                                                    {entry.comment && <p className="worklog-comment">Комментарий {entry.comment}</p>}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    </div>
                                    <div className="buttons">
                                        <button className="button secondary" onClick={() => setShowTimeModal(true)}>Списать время</button>
                                    </div>
                                </>
                        )}

                        {activeTab === "comments" && (
                            <div className="comments-section">
                                <p>Комментарии (в разработке)</p>
                            </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-around" }}>
                                {activeTab === "time" && (
                                    <div className="buttons">
                                        <button className="button secondary" onClick={() => setShowTimeModal(true)}>Списать время</button>
                                    </div>
                                )}
                                <div className="buttons">
                                    <button onClick={onClose} className="button secondary">Закрыть</button>
                                </div>
                            </div>
                        

                        {showTimeModal && (
                            <div className="modal-overlay" onClick={() => setShowTimeModal(false)}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <h3>Списание трудозатрат</h3>
                                    <input
                                        type="number"
                                        placeholder="Часы"
                                        min={0.1}
                                        step={0.1}
                                        value={hoursSpent}
                                        onChange={(e) => setHoursSpent(parseFloat(e.target.value))}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Тип работы"
                                        value={workType}
                                        onChange={(e) => setWorkType(e.target.value)}
                                    />
                                    <textarea
                                        placeholder="Комментарий"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <div className="buttons">
                                        <button className="button primary" onClick={handleAddWorkLog}>Списать</button>
                                        <button className="button secondary" onClick={() => setShowTimeModal(false)}>Отмена</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="error-text">Ошибка загрузки задачи</p>
                )}
            </div>
        </div>
    );
};

export default TaskDetails;
