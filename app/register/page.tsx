"use client";

import RegisterForm from "@/components/RegisterForm";
import "@/styles/auth.css";

export default function Register() {
    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="auth-title">Inscription</h1>
                <RegisterForm />
            </div>
        </div>
    );
}