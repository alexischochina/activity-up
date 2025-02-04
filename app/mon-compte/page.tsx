"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/User";
import "@/styles/profile.css";

export default function MonCompte() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<User | null>(null);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch("/api/user/profile");
            if (!response.ok) {
                setError("Erreur lors du chargement des informations");
                return;
            }
            const data = await response.json();
            setUser(data);
            setFormData(data);
        } catch (err) {
            setError("Erreur lors du chargement des informations");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                setError("Erreur lors de la mise à jour");
                return;
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            setIsEditing(false);
            setError("");
        } catch (err) {
            setError("Erreur lors de la mise à jour");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    return (
        <div className="profile-container">
            <div className="profile-box">
                <div className="profile-header">
                    <h1 className="profile-title">Mon Compte</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="edit-button"
                        >
                            Modifier
                        </button>
                    )}
                </div>

                {error && <div className="error-message">{error}</div>}

                {user && !isEditing ? (
                    <div className="profile-info">
                        <div className="info-group">
                            <label>Prénom</label>
                            <p>{user.firstname}</p>
                        </div>
                        <div className="info-group">
                            <label>Nom</label>
                            <p>{user.lastname}</p>
                        </div>
                        <div className="info-group">
                            <label>Email</label>
                            <p>{user.email}</p>
                        </div>
                    </div>
                ) : formData && isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Prénom</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Nom</label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="button-group">
                            <button type="submit" className="edit-button">
                                Enregistrer
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData(user);
                                    setError("");
                                }}
                                className="cancel-button"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                ) : null}
            </div>
        </div>
    );
}