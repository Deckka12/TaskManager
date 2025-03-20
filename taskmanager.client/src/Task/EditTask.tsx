import React, { useState, useEffect } from "react";
import axios from "axios";
import { updateTask } from "../services/taskService";
import API_BASE_URL from "../config";

interface TaskItem {
    id: string;
    title: string;
    description: string;
    projectId: string; // Обязательное поле
    status: number;
    priority: number;
    userId: string;
    performerId?: string | null;
    categoryId?: string | null;
    dueDate?: Date | undefined;
}

interface User {
    id: string;
    name: string;
}

interface Project {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
}

interface EditTaskProps {
    task: TaskItem;
    onClose: () => void;
    onTaskUpdated: () => void;
}

// 🔹 Функция для форматирования `Date` в `YYYY-MM-DD` (для input type="date")
const formatDate = (date?: Date | null): string => {
    return date ? new Date(date).toISOString().split("T")[0] : "";
};

const EditTask: React.FC<EditTaskProps> = ({ task, onClose, onTaskUpdated }) => {
    // 🔹 Используем `useState` без начального значения (будем загружать их через `useEffect`)
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");
    const [performerId, setPerformerId] = useState("");
    const [projectId, setProjectId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // 🔹 Загружаем существующие данные задачи при открытии окна
    useEffect(() => {
        setTitle(task.title || "");
        setDescription(task.description || "");
        setPriority(task.priority.toString());
        setStatus(task.status.toString());
        setPerformerId(task.performerId || "");
        setProjectId(task.projectId || "");
        setCategoryId(task.categoryId || "");
        setDueDate(formatDate(task.dueDate)); // 📌 Теперь `dueDate` предзаполняется в формате `YYYY-MM-DD`
    }, [task]);

    // 🔹 Загружаем данные для выпадающих списков (пользователи, проекты, категории)
    useEffect(() => {
        axios.get<User[]>(`${API_BASE_URL}/api/task/users`)
            .then(response => setUsers(response.data))
            .catch(error => console.error("Ошибка загрузки пользователей:", error));

        axios.get<Project[]>(`${API_BASE_URL}/api/task/project`)
            .then(response => setProjects(response.data))
            .catch(error => console.error("Ошибка загрузки проектов:", error));

        axios.get<Category[]>(`${API_BASE_URL}/api/task/categories`)
            .then(response => setCategories(response.data))
            .catch(error => console.error("Ошибка загрузки категорий:", error));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 🔹 Преобразуем `dueDate` в `Date | undefined`, убирая `null`
        const parsedDueDate: Date | undefined = dueDate ? new Date(dueDate) : undefined;

        const updatedTask: Partial<TaskItem> = {
            id: task.id,
            title,
            description,
            priority: Number(priority),
            status: Number(status),
            projectId: projectId || task.projectId,
            categoryId,
            dueDate: parsedDueDate === null ? undefined : parsedDueDate, // ✅ Исправлено
            performerId
        };

        await updateTask(task.id, updatedTask);
        onTaskUpdated();
        onClose();
    };




    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="create-task-container">
                    <h2>Редактировать задачу</h2>

                    <div className="input-group">
                        <label>Название задачи</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label>Описание</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <div className="input-group">
                            <label>Приоритет</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="0">Низкий</option>
                                <option value="1">Средний</option>
                                <option value="2">Высокий</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Статус</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="0">Новая</option>
                                <option value="1">В процессе</option>
                                <option value="2">Завершена</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Дата завершения</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Ответственный исполнитель</label>
                        <select value={performerId} onChange={(e) => setPerformerId(e.target.value)}>
                            <option value="">Выберите исполнителя</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Проект</label>
                        <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                            <option value="">Выберите проект</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Категория</label>
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                            <option value="">Выберите категорию</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="buttons">
                        <button onClick={handleSubmit} className="buttonstyle">Сохранить</button>
                        <button onClick={onClose} className="button secondary">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTask;
