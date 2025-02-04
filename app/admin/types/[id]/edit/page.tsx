"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/admin.css";

interface TypeActivite {
    id: number;
    nom: string;
}

export default function EditType({ params }: { params: { id: string } }) {
    const [nom, setNom] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchType = async () => {
            try {
                const response = await fetch(`/api/admin/types/${params.id}`);
                if (!response.ok) {
                    setError("Erreur lors du chargement du type");
                    return;
                }
                const data = await response.json();
                setNom(data.nom);
            } catch (err) {
                setError("Erreur lors du chargement du type");
            }
        };

        fetchType();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/admin/types/${params.id}`, {
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
        } catch (err) {
            setError("Erreur lors de la modification");
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-box">
                <div className="admin-header">
                    <h1>Modifier le type d'activité</h1>
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