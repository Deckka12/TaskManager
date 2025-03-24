import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const CreateTask: React.FC = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [userRoles, setUserRoles] = useState<{ userId: string; roleId: string }[]>([]);


    const [name, setTitle] = useState("");
    const [description, setDescription] = useState("");
    useEffect(() => {
        if (!auth?.token) {
            navigate("/login");
            return;
        }
        const fetchData = async () => {
            try {
                const [usersRes, rolesRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/task/users`, {
                        headers: { Authorization: `Bearer ${auth.token}` }
                    }),
                    axios.get(`${API_BASE_URL}/api/projectrole`, {
                        headers: { Authorization: `Bearer ${auth.token}` }
                    }),
                ]);
                setUsers(usersRes.data);
                setRoles(rolesRes.data);
            } catch (err) {
                console.error("Ошибка при загрузке пользователей или ролей", err);
            }
        };

        fetchData();

    }, [auth, navigate]);

    const handleUserRoleChange = (userId: string, roleId: string) => {
        setUserRoles(prev =>
            prev.some(ur => ur.userId === userId)
                ? prev.map(ur => ur.userId === userId ? { ...ur, roleId } : ur)
                : [...prev, { userId, roleId }]
        );
    };

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
            ownerId: auth.user.id,
            userRoles: userRoles, 
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
            {users.map((user) => (
                <div key={user.id} style={{ marginBottom: '10px' }}>
                    <span>{user.username}</span>
                    <select
                        onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>Выберите роль</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </select>
                </div>
            ))}
            <button onClick={handleCreateTask}>Создать проект</button>
        </div>
    );
};

export default CreateTask;
