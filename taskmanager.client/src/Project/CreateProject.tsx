import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../config";
import './DragDrop.css'; // Подключаем CSS
import {
    useDrag,
    useDrop,
    DndProvider,
    DragSourceMonitor
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemTypes = {
    USER: "user"
};

interface Props {
    onClose: () => void;
    onSuccess?: () => void;
}

interface User {
    id: string;
    name: string;
    username: string;
}

interface Role {
    id: string;
    name: string;
}

interface UserRole {
    userId: string;
    roleId: string;
}

const DraggableUser: React.FC<{ user: User }> = ({ user }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.USER,
        item: { user },
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
        })
    }), [user]);

    return (
        <div
            ref={(node) => {
                if (node) drag(node);
            }}
            className="user-chip"
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            {user.name} ({user.username})
        </div>
    );
};

const DroppableRole: React.FC<{
    role: Role;
    users: User[];
    onDropUser: (user: User, roleId: string) => void;
    onRemoveUser: (userId: string, roleId: string) => void;
}> = ({ role, users, onDropUser, onRemoveUser }) => {
    const [, drop] = useDrop(() => ({
        accept: ItemTypes.USER,
        drop: (item: { user: User }) => onDropUser(item.user, role.id),
    }), [role, users]);

    return (
        <div
            ref={(node) => {
                if (node) drop(node);
            }}
            className="role-block"
        >
            <h4>{role.name}</h4>
            <div className="assigned-users">
                {users.map((user) => (
                    <div key={user.id} className="assigned-user">
                        <span>{user.name} ({user.username})</span>
                        <button onClick={() => onRemoveUser(user.id, role.id)}>×</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CreateProjectModal: React.FC<Props> = ({ onClose, onSuccess }) => {
    const auth = useContext(AuthContext);
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [userRoles, setUserRoles] = useState<UserRole[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, rolesRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/task/users`, {
                        headers: { Authorization: `Bearer ${auth?.token}` },
                    }),
                    axios.get(`${API_BASE_URL}/api/projectrole`, {
                        headers: { Authorization: `Bearer ${auth?.token}` },
                    }),
                ]);
                setUsers(usersRes.data);
                setRoles(rolesRes.data);
            } catch (err) {
                console.error("Ошибка при загрузке данных", err);
            }
        };

        fetchData();
    }, [auth]);

    const handleDropUser = (user: User, roleId: string) => {
        const alreadyAssigned = userRoles.some(
            (ur) => ur.userId === user.id && ur.roleId === roleId
        );
        if (!alreadyAssigned) {
            setUserRoles((prev) => [...prev, { userId: user.id, roleId }]);
        }
    };

    const handleRemoveUser = (userId: string, roleId: string) => {
        setUserRoles((prev) => prev.filter((ur) => !(ur.userId === userId && ur.roleId === roleId)));
    };

    const getUsersByRole = (roleId: string) => {
        return userRoles
            .filter((ur) => ur.roleId === roleId)
            .map((ur) => users.find((u) => u.id === ur.userId))
            .filter((u): u is User => Boolean(u));
    };

    const handleCreate = async () => {
        if (!name.trim() || !description.trim()) {
            alert("Заполните все поля!");
            return;
        }

        const requestBody = {
            name,
            description,
            ownerId: auth?.user?.id,
            userRoles,
        };

        try {
            await axios.post(`${API_BASE_URL}/api/project/create`, requestBody, {
                headers: { Authorization: `Bearer ${auth?.token}` },
            });
            alert("Проект успешно создан!");
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("Ошибка при создании проекта:", err);
            alert("Не удалось создать проект.");
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="modal-overlay">
                <div className="modal">
                    <h2 className="modal-title">Создать проект</h2>

                    <input
                        className="modal-input"
                        placeholder="Название проекта"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <textarea
                        className="modal-input"
                        placeholder="Описание проекта"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="drag-section">
                        <div className="user-pool">
                            <h4>Все пользователи:</h4>
                            <div className="user-list">
                                {users.map((user) => (
                                    <DraggableUser key={user.id} user={user} />
                                ))}
                            </div>
                        </div>

                        <div className="roles-area">
                            {roles.map((role) => (
                                <DroppableRole
                                    key={role.id}
                                    role={role}
                                    users={getUsersByRole(role.id)}
                                    onDropUser={handleDropUser}
                                    onRemoveUser={handleRemoveUser}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button className="btn cancel" onClick={onClose}>Отмена</button>
                        <button className="btn create" onClick={handleCreate}>Создать</button>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default CreateProjectModal;