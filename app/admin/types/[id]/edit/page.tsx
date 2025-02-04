"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import "@/styles/admin.css";
export default function EditType() {
    const [nom, setNom] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        const fetchType = async () => {
            try {
                const response = await fetch(`/api/admin/types/${id}`);
                if (!response.ok) {
                    setError("Erreur lors du chargement du type");
                    return;
                }
                const data = await response.json();
                setNom(data.nom);
            } catch {
                setError("Erreur lors du chargement du type");
            }
        };

        fetchType();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/admin/types/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nom }),
            });

            if (!response.ok) {
                setError("Erreur lors de la modification");
                return;
            }

            router.push("/admin/activites");
        } catch {
            setError("Erreur lors de la modification");
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-box">
                <div className="admin-header">
                    <h1>Modifier le type d&#39;activité</h1>
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
                            Enregistrer
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