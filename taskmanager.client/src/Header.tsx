import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { Bell, UserCircle } from "lucide-react";
import "./Header.css";

const Header: React.FC = () => {
    const auth = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="logo">
                    TaskManager
                </Link>
            </div>

            <nav className="nav">
                <Link to="/projects" className="nav-link">Проекты</Link>
                <Link to="/tasks" className="nav-link">Задачи</Link>
                <Link to="/reports" className="nav-link">Отчёты</Link>
                <Link to="/team" className="nav-link">Команда</Link>
            </nav>

            <div className="header-right">
                <button className="icon-button" title="Уведомления">
                    <Bell size={20} />
                </button>

                {auth?.user ? (
                    <div className="profile-menu" ref={menuRef}>
                        <div onClick={() => setMenuOpen(!menuOpen)} className="profile-icon">
                            <UserCircle size={24} />
                        </div>
                        {menuOpen && (
                            <div className="profile-dropdown">
                                <span className="user-name">Привет, {auth.user.name}!</span>
                                <Link to="/profile">Профиль</Link>
                                <Link to="/settings">Настройки</Link>

                                {auth.user.roles.includes("admin") && (
                                    <Link to="/admin">Админ-панель</Link>
                                )}

                                <button className="logout-button" onClick={auth.logout}>Выйти</button>
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="auth-links">
                        <Link to="/login" className="nav-link">Войти</Link>
                        <Link to="/register" className="nav-link">Регистрация</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;