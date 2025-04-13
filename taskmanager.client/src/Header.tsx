import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { Bell, UserCircle } from "lucide-react";
import "./Header.css";
import API_BASE_URL from "./config";
import LoginModal from "./Login/Login"; // путь к файлу
import RegisterModal from "./Login/Register";


interface Notification {
    id: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

const Header: React.FC = () => {
    const auth = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);


    const profileMenuRef = useRef<HTMLDivElement>(null);
    const notificationMenuRef = useRef<HTMLDivElement>(null);

    const loadNotifications = async () => {
        if (!auth?.token) return;
        try {
            const res = await axios.get<Notification[]>(`${API_BASE_URL}/api/notifications/my`, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            const unread = res.data.filter(n => !n.isRead).length;
            setUnreadCount(unread);
            setNotifications(res.data);
        } catch (e) {
            console.error("Ошибка при загрузке уведомлений:", e);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await axios.post(`${API_BASE_URL}/api/notifications/read/${id}`, {}, {
                headers: { Authorization: `Bearer ${auth?.token}` }
            });
            setNotifications(prev => {
                const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
                setUnreadCount(updated.filter(n => !n.isRead).length);
                return updated;
            });
        } catch (e) {
            console.error("Ошибка при отметке уведомления:", e);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node) &&
                notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!auth?.user?.id || auth.loading) return;
        loadNotifications();
    }, [auth?.user?.id, auth?.loading]);

    useEffect(() => {
        if (notifOpen && auth?.user?.id && !auth.loading) {
            loadNotifications();
        }
    }, [notifOpen]);

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="logo">TaskManager</Link>
            </div>

            <nav className="nav">
                <Link to="/projects" className="nav-link">Проекты</Link>
                <Link to="/tasks" className="nav-link">Задачи</Link>
                <Link to="/reports" className="nav-link">Отчёты</Link>
                <Link to="/team" className="nav-link">Команда</Link>
            </nav>

            <div className="header-right">
                {auth?.user && (
                    <div className="notification-container" ref={notificationMenuRef}>
                        <button
                            className="icon-button notification-btn"
                            title="Уведомления"
                            onClick={() => setNotifOpen(!notifOpen)}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="notification-badge">{unreadCount}</span>
                            )}
                        </button>
                        {notifOpen && (
                            <div className="notifications-dropdown">
                                <h4>Уведомления</h4>
                                {notifications.length === 0 ? (
                                    <p className="empty">Нет уведомлений</p>
                                ) : (
                                    notifications.map(n => (
                                        <div
                                            key={n.id}
                                            className={`notification-item ${!n.isRead ? "unread" : ""}`}
                                            onClick={() => markAsRead(n.id)}
                                        >
                                            <p>{n.message}</p>
                                            <small>{new Date(n.createdAt).toLocaleString()}</small>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}

                {auth?.user ? (
                    <div className="profile-menu" ref={profileMenuRef}>
                        <div className="profile-icon" onClick={() => setMenuOpen(!menuOpen)}>
                            <UserCircle size={24} />
                        </div>
                        {menuOpen && (
                            <div className="profile-dropdown" style={{ zIndex: 999 }}>
                                <span className="user-name">Привет, {auth.user.name}!</span>
                                <Link to="/profile">Профиль</Link>
                                <Link to="/settings">Настройки</Link>

                                {auth.user.roles.includes("admin") && (
                                    <Link to="/admin">Админ-панель</Link>
                                )}

                                <button
                                    className="logout-button"
                                    onClick={() => {
                                        console.log("⛔ Нажата кнопка выхода");
                                        auth.logout();
                                    }}
                                >
                                    Выйти
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                        <div className="auth-links">
                            <button className="nav-link" onClick={() => setLoginModalOpen(true)}>Войти</button>
                            <button className="nav-link" onClick={() => setRegisterModalOpen(true)}>Регистрация</button>
                        </div>
                )}
            </div>
            {loginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
            {registerModalOpen && <RegisterModal onClose={() => setRegisterModalOpen(false)} />}


        </header>

    );
};

export default Header;
