import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface User {
    id: string;
    name: string;
    email: string;
    exp: number;
}

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    user: User | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                console.log("Декодированный JWT:", decoded); // Добавляем логирование

                if (decoded && decoded.sub && decoded.name && decoded.email) {
                    setUser({
                        id: decoded.sub,
                        name: decoded.name,
                        email: decoded.email,
                        exp: decoded.exp
                    });
                } else {
                    console.error("Ошибка декодирования JWT: не хватает данных", decoded);
                    setToken(null);
                    setUser(null);
                }
            } catch (error) {
                console.error("Ошибка декодирования JWT:", error);
                setToken(null);
                setUser(null);
            }
        }
    }, [token]);


    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post("http://localhost:5213/api/auth/login", { email, password });
            localStorage.setItem("token", response.data.token);
            setToken(response.data.token);
        } catch (error) {
            console.error("ќшибка входа:", error);
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
