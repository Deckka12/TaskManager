import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import API_BASE_URL from "../config";


interface User {
    id: string;
    name: string;
    email: string;
    exp: number;
    roles: string[];
}

interface JwtPayload {
    sub: string;
    name: string;
    email: string;
    exp: number;
    role?: string | string[];
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
}

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    user: User | null;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token);

                let roles: string[] = [];

                if (Array.isArray(decoded.role)) {
                    roles = decoded.role;
                } else if (typeof decoded.role === "string") {
                    roles = [decoded.role];
                } else if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
                    const raw = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                    roles = Array.isArray(raw) ? raw : [raw];
                }

                setUser({
                    id: decoded.sub,
                    name: decoded.name,
                    email: decoded.email,
                    exp: decoded.exp,
                    roles,
                });
            } catch (error) {
                console.error("Ошибка декодирования JWT:", error);
                setToken(null);
                setUser(null);
            }
        }
        setLoading(false); 
    }, [token]);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
            const token = response.data.token;
            localStorage.setItem("token", token);
            setToken(token);
        } catch (error) {
            console.error("Ошибка входа:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        console.log("pfikb c.lf");

    };

    return (
        <AuthContext.Provider value={{ token, login, logout, user, loading }}>
            {children}
        </AuthContext.Provider>

    );
};

export default AuthProvider;
