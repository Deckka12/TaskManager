import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateTask: React.FC = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setTitle] = useState("");
    const [description, setDescription] = useState("");
    useEffect(() => {
        if (!auth?.token) {
            navigate("/login");
            return;
        }


    }, [auth, navigate]);

    const handleCreateTask = async () => {
        if (!name.trim() || !description.trim() ) {
            alert("Заполните все поля!");
            return;
        }

        if (!auth?.user?.id) {
            alert("Ошибка: не удалось определить пользователя.");
            return;
        }

     

        const requestBody = {
            name,
            description,
            ownerid: auth.user.id
        };

        console.log("Отправляемые данные:", requestBody);

        try {
            const response = await axios.post(
                "https://localhost:7121/api/project/create",
                requestBody,
                { headers: { Authorization: `Bearer ${auth?.token}` } }
            );

            console.log("Ответ сервера:", response.data);
            alert("Проект успешно создан!");
            navigate("/project");
        } catch (error) {
            console.error("Ошибка при создании проект:", error);
            alert("Не удалось создать проект.");
        }
    };

    return (
        <div className="create-task-container">
            <h2>Создать проект</h2>

            <input
                type="text"
                placeholder="Название проекта"
                value={name}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Описание проекта"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleCreateTask}>Создать проект</button>
        </div>
    );
};

export default CreateTask;
