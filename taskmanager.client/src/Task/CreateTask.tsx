import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../config";
import MarkdownCommentEditor from "../MarkdownCommentEditor";
import "./TaskList.css"; // убедись, что стили подключены

interface User {
    id: string;
    name: string;
}

interface Project {
    id: string;
    name: string;
    description: string;
}

interface Category {
    id: string;
    name: string;
}

interface CreateTaskProps {
    onClose: () => void;
    getTask: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ onClose, getTask }) => {
    const auth = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [preview, setPreview] = useState(false);
    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
        projectId?: string;
        categoryId?: string;
    }>({});

    const [priority, setPriority] = useState("Medium");
    const [projectId, setProjectId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [performerId, setPerformerId] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [dueDate, setDueDate] = useState("");

    useEffect(() => {
        axios.get<User[]>(`${API_BASE_URL}/api/task/users`)
            .then(response => setUsers(response.data))
            .catch(error => console.error('Ошибка при загрузке пользователей:', error));

        axios.get<Project[]>(`${API_BASE_URL}/api/project/project`)
            .then(response => setProjects(response.data))
            .catch(error => console.error('Ошибка при загрузке проектов:', error));

        axios.get<Category[]>(`${API_BASE_URL}/api/task/categories`)
            .then(response => setCategories(response.data))
            .catch(error => console.error('Ошибка при загрузке категорий:', error));
    }, []);

    const handleCreateTask = async () => {
        const newErrors: typeof errors = {};

        if (!title.trim()) newErrors.title = "Название задачи обязательно";
        else if (title.length > 100) newErrors.title = "Название не может превышать 100 символов";

        if (!description.trim()) newErrors.description = "Описание обязательно";
        if (!projectId) newErrors.projectId = "Проект обязателен";
        if (!categoryId) newErrors.categoryId = "Категория обязательна";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        if (!auth?.user?.id) return;

        const statusEnum = 0;
        const priorityEnum = priority === "Low" ? 0 : priority === "Medium" ? 1 : 2;

        const requestBody = {
            title,
            description,
            priority: priorityEnum,
            projectId,
            status: statusEnum,
            userId: auth.user.id,
            categoryId,
            dueDate,
            performerId
        };

        try {
            const headers = { Authorization: `Bearer ${auth?.token}` };
            await axios.post(`${API_BASE_URL}/api/task/create`, requestBody, { headers });
            onClose();
            getTask();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Ошибка Axios:", error.response?.data || error.message);
            } else {
                console.error("Неизвестная ошибка:", error);
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="create-task-container">
                    <h2>Создать задачу</h2>

                    {/* Название */}
                    <div className="input-group">
                        <label>Название задачи</label>
                        {errors.title && <div className="field-error">{errors.title}</div>}
                        <input
                            type="text"
                            className={errors.title ? "input-error" : ""}
                            placeholder="Введите название"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Описание */}
                    <div className="input-group">
                        <label>Описание</label>
                        {errors.description && <div className="field-error">{errors.description}</div>}
                        <div className={errors.description ? "editor-error" : ""}>
                            <MarkdownCommentEditor
                                text={description}
                                setText={setDescription}
                                preview={preview}
                                setPreview={setPreview}
                            />
                        </div>
                    </div>

                    {/* Группа полей */}
                    <div className="form-group">
                        <div className="input-group">
                            <label>Приоритет</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="Low">Низкий</option>
                                <option value="Medium">Средний</option>
                                <option value="High">Высокий</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Дата завершения</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                min="2025-01-01"
                                max="2035-12-31"
                            />
                        </div>
                    </div>

                    {/* Исполнитель */}
                    <div className="input-group">
                        <label>Ответственный исполнитель</label>
                        <select value={performerId} onChange={(e) => setPerformerId(e.target.value)}>
                            <option value="">Выберите</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Проект */}
                    <div className="input-group">
                        <label>Проект</label>
                        {errors.projectId && <div className="field-error">{errors.projectId}</div>}
                        <select
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            className={errors.projectId ? "input-error" : ""}
                        >
                            <option value="">Выберите</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Категория */}
                    <div className="input-group">
                        <label>Категория</label>
                        {errors.categoryId && <div className="field-error">{errors.categoryId}</div>}
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className={errors.categoryId ? "input-error" : ""}
                        >
                            <option value="">Выберите</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Кнопки */}
                    <div className="buttons">
                        <button onClick={handleCreateTask} className="buttonstyle">Создать задачу</button>
                        <button onClick={onClose} className="button secondary">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTask;
