"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
    isLoggedIn: boolean;
    isAdmin: boolean;
    updateAuth: (loggedIn: boolean, admin: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch("/api/user/profile");
            const data = await response.json();
            
            if (response.ok && data) {
                setIsAdmin(data.role === "admin");
                setIsLoggedIn(true);
            } else {
                setIsAdmin(false);
                setIsLoggedIn(false);
            }
        } catch (error) {
            setIsAdmin(false);
            setIsLoggedIn(false);
        }
    };

    const updateAuth = (loggedIn: boolean, admin: boolean) => {
        setIsLoggedIn(loggedIn);
        setIsAdmin(admin);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, updateAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
} 