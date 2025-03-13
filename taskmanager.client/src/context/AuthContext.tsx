import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface User {
    name: string;
    exp: number;
    // ������ ������ ����, ���� ��� ���� � ������
}

interface AuthContextType {
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    user: User | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (token) {
            const decoded: User = jwtDecode(token);
            setUser(decoded);
        }
    }, [token]);

    const login = async (email: string, password: string) => {
        try {
            console.log("���������� ������:", { email, password }); // ��� ��� ��������
            const response = await axios.post("http://localhost:5213/api/auth/login", {
                email: email.trim(), // ������� �������
                password
            });

            console.log("����� �������:", response.data);
            localStorage.setItem("token", response.data.token);
            setToken(response.data.token);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("������ �����:", error.response?.data || error.message);
            } else {
                console.error("����������� ������:", error);
            }
        }
    };


    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
