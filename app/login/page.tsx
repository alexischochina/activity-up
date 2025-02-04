"use client";

import LoginForm from "@/components/LoginForm";
import "@/styles/auth.css";
import React from "react";

export default function Login() {
    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className="auth-title">Connexion</h1>
                <LoginForm />
            </div>
        </div>
    );
}