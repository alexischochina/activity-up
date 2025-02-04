"use client";

import LoginForm from "@/components/LoginForm";
import "@/styles/auth.css";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
    const { updateAuth } = useAuth();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/auth/login", {
                // ... configuration de la requête
            });
            
            if (response.ok) {
                const data = await response.json();
                updateAuth(true, data.role === "admin");
                router.push("/activites");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="auth-title">Connexion</h1>
                <LoginForm />
            </div>
        </div>
    );
}