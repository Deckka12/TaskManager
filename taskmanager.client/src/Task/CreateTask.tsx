import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Project {
    id: string;
    description: string;
}

const CreateTask: React.FC = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [projectId, setProjectId] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    useEffect(() => {
        if (!auth?.token) {
            navigate("/login");
            return;
        }

        axios.get<Project[]>("http://localhost:5213/api/task/project", {
            headers: { Authorization: `Bearer ${auth.token}` }
        })
            .then(response => setProjects(response.data))
            .catch(error => console.error("Ошибка загрузки проектов:", error));
    }, [auth, navigate]);

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
            status: statusEnum, // Enum, а не строка!
            userId: auth.user.id
        };

        console.log("Отправляемые данные:", requestBody);

        try {
            const response = await axios.post(
                "https://localhost:7121/api/task/create",
                requestBody,
                { headers: { Authorization: `Bearer ${auth?.token}` } }
            );

            console.log("Ответ сервера:", response.data);
            alert("Задача успешно создана!");
            navigate("/tasks");
        } catch (error) {
            console.error("Ошибка при создании задачи:", error);
            alert("Не удалось создать задачу.");
        }
    };

    return (
        <div className="create-task-container">
            <h2>Создать задачу</h2>

            <input
                type="text"
                placeholder="Название задачи"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Описание задачи"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Низкий</option>
                <option value="Medium">Средний</option>
                <option value="High">Высокий</option>
            </select>

            <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                <option value="">Выберите проект</option>
                {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.description}</option>
                ))}
            </select>

            <button onClick={handleCreateTask}>Создать задачу</button>
        </div>
    );
};

export default CreateTask;
