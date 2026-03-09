import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'admin' | 'super_admin';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('mathinova_token');
        if (savedToken) {
            try {
                const decoded: any = jwtDecode(savedToken);
                if (decoded.exp * 1000 > Date.now()) {
                    setToken(savedToken);
                    setUser(decoded);
                } else {
                    localStorage.removeItem('mathinova_token');
                }
            } catch (err) {
                localStorage.removeItem('mathinova_token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem('mathinova_token', newToken);
        setToken(newToken);
        const decoded: any = jwtDecode(newToken);
        setUser(decoded);
    };

    const logout = () => {
        localStorage.removeItem('mathinova_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
