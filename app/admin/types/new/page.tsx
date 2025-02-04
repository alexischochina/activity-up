"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/admin.css";

export default function NewTypeActivite() {
    const [nom, setNom] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/admin/types", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nom }),
            });

            if (!response.ok) {
                setError("Erreur lors de la création du type d'activité");
                return;
            }

            router.push("/admin/activites");
        } catch (err) {
            setError("Erreur lors de la création du type d'activité");
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-box">
                <div className="admin-header">
                    <h1>Nouveau type d'activité</h1>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label htmlFor="nom">Nom du type</label>
                        <input
                            type="text"
                            id="nom"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit" className="admin-button">
                            Créer
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/admin/activites")}
                            className="cancel-button"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 