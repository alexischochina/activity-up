"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginForm() {
    const [error, setError] = useState(<></>);
    const router = useRouter();
    const pathname = usePathname();
    const { updateAuth } = useAuth();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission

        // Get data from form
        const email = e.currentTarget.email.value.trim();
        const password = e.currentTarget.password.value.trim();
        // If any data is empty
        if (email == "" || password == "") {
            setError(<p>All fields are required</p>);
        } else {
            try {
                // Fetch "/api/login" route
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });
                // If there is an error
                if (!response.ok || response.status >= 300) {
                    const { message } = await response.json();
                    setError(<p>{message}</p>);
                } else {
                    const data = await response.json();
                    // Mise à jour du contexte avec le rôle correct
                    updateAuth(true, data.role === "admin");
                    
                    if (pathname.startsWith("/login")) {
                        router.push("/"); // Redirect to /mon-compte page
                    }
                    router.refresh(); // Keep this page
                }
            } catch (error) {
                console.error(error);
                setError(<p>An error occured</p>);
            }
        }
    };

    return (
        <>
            <form method="POST" onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="john.doe@gmail.com"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password"
                    />
                </div>
                <button type="submit" className="submit-button">
                    Se connecter
                </button>
                <div className="auth-link">
                    <Link href="/register">
                        Pas encore de compte ? S&#39;inscrire
                    </Link>
                </div>
            </form>
            {error && <div className="error-message">{error}</div>}
        </>
    );
}