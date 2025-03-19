import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const Register: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!name || !email || !password) {
            alert("Заполните все поля!");
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/api/auth/register`, { name, email, password });
            alert("Регистрация успешна!");
            navigate("/login"); // Перенаправляем на страницу входа
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            alert("Ошибка регистрации. Возможно, email уже используется.");
        }
    };

    return (
        <div>
            <h2>Регистрация</h2>
            <input type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Зарегистрироваться</button>
        </div>
    );
};

export default Register;
