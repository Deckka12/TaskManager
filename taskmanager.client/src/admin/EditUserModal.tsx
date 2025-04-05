import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import axios from 'axios';
import './AdminPanel.css';

interface RoleItem {
    id: string;
    name: string;
}

interface EditUserModalProps {
    user: {
        id: string;
        name: string;
        email: string;
        userRoles: {
            role: {
                name: string;
            };
        }[];
    };
    roles: RoleItem[];
    onClose: () => void;
    onSave: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, roles, onClose, onSave }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    useEffect(() => {
        setName(user.name);
        setEmail(user.email);
        setSelectedRoles(user.userRoles.map((ur) => ur.role.name));
    }, [user]);

    const handleToggleRole = (roleName: string) => {
        setSelectedRoles((prev) =>
            prev.includes(roleName)
                ? prev.filter((r) => r !== roleName)
                : [...prev, roleName]
        );
    };

    const handleSave = async () => {
        try {
            await axios.put(`${API_BASE_URL}/api/admin/users/${user.id}`, {
                name,
                email,
                roles: selectedRoles,
            });
            onSave();
        } catch (error) {
            console.error('Ошибка при сохранении пользователя:', error);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Редактировать пользователя</h3>
                <label>Имя</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />

                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />

                <label>Роли</label>
                <div className="roles-list">
                    {roles.map((role) => (
                        <label key={role.id}>
                            <input
                                type="checkbox"
                                checked={selectedRoles.includes(role.name)}
                                onChange={() => handleToggleRole(role.name)}
                            />
                            {role.name}
                        </label>
                    ))}
                </div>

                <div className="buttons">
                    <button className="button primary" onClick={handleSave}>Сохранить</button>
                    <button className="button secondary" onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default EditUserModal;