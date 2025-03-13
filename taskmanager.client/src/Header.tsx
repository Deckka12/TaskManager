import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Подключаем стили

const Header: React.FC = () => {
    return (
        <nav className="header">
            <div className="header-container">
                <h1 className="logo">TaskManager</h1>
                <ul className="nav-links">
                    <li><Link to="/tasks">Задачи</Link></li>
                    <li><Link to="/projects">Проекты</Link></li>
                </ul>
            </div>
        </nav>
    );
}

export default Header;
