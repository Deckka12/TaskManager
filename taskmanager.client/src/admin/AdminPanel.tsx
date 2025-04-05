import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../config';
import './AdminPanel.css';
import EditUserModal from './EditUserModal';

interface UserItem {
    id: string;
    name: string;
    email: string;
    userRoles: {
        role: {
            name: string;
        }
    }[];
}

interface RoleItem {
    id: string;
    name: string;
}

interface CategoryItem {
    id: string;
    name: string;
}

const AdminPanel: React.FC = () => {
    const auth = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'categories'>('users');

    const [users, setUsers] = useState<UserItem[]>([]);
    const [roles, setRoles] = useState<RoleItem[]>([]);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

    const getAuthHeaders = () => {
        return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
        fetchCategories();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
                headers: getAuthHeaders(),
            });
            setUsers(response.data);
        } catch (err) {
            console.error('Ошибка загрузки пользователей', err);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/roles`, {
                headers: getAuthHeaders(),
            });
            setRoles(response.data);
        } catch (err) {
            console.error('Ошибка загрузки ролей', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/categories`, {
                headers: getAuthHeaders(),
            });
            setCategories(response.data);
        } catch (err) {
            console.error('Ошибка загрузки категорий', err);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("Удалить пользователя?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, {
                headers: getAuthHeaders()
            });
            fetchUsers();
        } catch (error) {
            console.error("Ошибка удаления пользователя:", error);
        }
    };

    return (
        <div className="admin-panel">
            <h2>Админ-панель</h2>
            <div className="tabs">
                <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>Пользователи</button>
                <button onClick={() => setActiveTab('roles')} className={activeTab === 'roles' ? 'active' : ''}>Роли</button>
                <button onClick={() => setActiveTab('categories')} className={activeTab === 'categories' ? 'active' : ''}>Категории</button>
            </div>

            {activeTab === 'users' && (
                <div className="tab-content">
                    <h3>Пользователи</h3>
                    {users.map(user => (
                        <div key={user.id} className="usersRole">
                            <strong>{user.name}</strong> ({user.email})<br />
                            <span>
                                Роли: {user.userRoles.map(ur => ur.role.name).join(", ")}
                            </span>
                            <div className="user-actions">
                                <button className="edit-button" onClick={() => setSelectedUser(user)}>Редактировать</button>
                                <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Удалить</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'roles' && (
                <div className="tab-content">
                    <h3>Роли</h3>
                    <ul>
                        {roles.map(role => (
                            <li key={role.id}>{role.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'categories' && (
                <div className="tab-content">
                    <h3>Категории</h3>
                    <ul>
                        {categories.map(cat => (
                            <li key={cat.id}>{cat.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    roles={roles}
                    onClose={() => setSelectedUser(null)}
                    onSave={() => {
                        setSelectedUser(null);
                        fetchUsers();
                    }}
                />
            )}
        </div>
    );
};

export default AdminPanel;
