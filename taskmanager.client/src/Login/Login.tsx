import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./LoginModal.css";

interface Props {
    onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ onClose }) => {
    const auth = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Введите email и пароль!");
            return;
        }

        if (auth) {
            await auth.login(email, password);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" >
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Вход</h2>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleLogin}>Войти</button>
                <p>Нет аккаунта? <a href="/register">Регистрация</a></p>
            </div>
        </div>
    );
};

export default LoginModal;
