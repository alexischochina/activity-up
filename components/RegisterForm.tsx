"use client";

import { hashPassword } from "@/utils/bcryptjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormEvent } from "react";
import Link from "next/link";

export default function RegisterForm() {
    const [error, setError] = useState(<></>);
    const router = useRouter();

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission

        // Get data from form
        const firstname = e.currentTarget.firstname.value.trim();
        const lastname = e.currentTarget.lastname.value.trim();
        const email = e.currentTarget.email.value.trim();
        const plainPassword = e.currentTarget.password.value.trim();
        // If any data is empty
        if (
            firstname == "" ||
            lastname == "" ||
            email == "" ||
            plainPassword == ""
        ) {
            setError(<p>All fields are required</p>);
        } else {
            try {
                const password = await hashPassword(plainPassword); // Hash password
                // Fetch "/api/register" route
                const response = await fetch("/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstname,
                        lastname,
                        email,
                        password,
                    }),
                });
                // If there is an error (user already exists for exemple)
                if (!response.ok || response.status >= 300) {
                    const { message } = await response.json();
                    setError(<p>{message}</p>);
                } else {
                    router.push("/login"); // Redirect to login page
                }
            } catch (error) {
                console.error(error);
                setError(<p>An error occured</p>);
            }
        }
    };

    return (
        <>
            <form method="POST" onSubmit={handleRegister} className="space-y-6">
                <div className="form-group">
                    <label htmlFor="firstname">Prénom</label>
                    <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        placeholder="John"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastname">Nom</label>
                    <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        placeholder="Doe"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="john.doe@gmail.com"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="submit-button"
                    >
                        S'inscrire
                    </button>
                </div>
                <div className="auth-link">
                    <Link href="/login" className="text-blue-600 hover:text-blue-500">
                        Déjà un compte ? Se connecter
                    </Link>
                </div>
            </form>
            {error && <div className="error-message">{error}</div>}
        </>
    );
}