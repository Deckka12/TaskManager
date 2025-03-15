import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Link } from 'react-router-dom';
import './Header.css'; // Подключаем стили

const Header: React.FC = () => {
    const auth = useContext(AuthContext);

    return (
        <nav className="header">
            <div className="header-container">
                <h1 className="logo">TaskManager</h1>
                <ul className="nav-links">
                    <li><Link to="/tasks">Задачи</Link></li>
                    <li><Link to="/projects">Проекты</Link></li>
                    {auth?.user && <li><Link to="/createProject">+ Создать проект</Link></li>}
                    {auth?.user ? (
                        <li className="user-menu">
                            <span className="user-name">Привет, {auth.user.name}!</span>
                            <button className="logout-button" onClick={auth.logout}>Выйти</button>
                        </li>
                    ) : (
                        <>
                            <li><Link to="/login">Войти</Link></li>
                            <li><Link to="/register">Регистрация</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Header;
