"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/admin.css";

interface TypeActivite {
    id: number;
    nom: string;
}

interface Activite {
    id: number;
    nom: string;
    type_id: number;
    places_disponibles: number;
    description: string;
    datetime_debut: string;
    duree: number;
}

export default function AdminActivites() {
    const [types, setTypes] = useState<TypeActivite[]>([]);
    const [activites, setActivites] = useState<Activite[]>([]);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchTypes();
        fetchActivites();
    }, []);

    const fetchTypes = async () => {
        try {
            const response = await fetch("/api/admin/types");
            if (!response.ok) {
                setError("Erreur lors du chargement des types d'activités");
                return;
            }
            const data = await response.json();
            setTypes(data);
        } catch {
            setError("Erreur lors du chargement des types d'activités");
        }
    };

    const fetchActivites = async () => {
        try {
            const response = await fetch("/api/admin/activites");
            if (!response.ok) {
                setError("Erreur lors du chargement des activités");
                return;
            }
            const data = await response.json();
            setActivites(data);
        } catch {
            setError("Erreur lors du chargement des activités");
        }
    };

    const handleDeleteType = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce type d'activité ?")) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/types/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
                return;
            }

            setTypes(types.filter(type => type.id !== id));
        } catch {
            setError("Erreur lors de la suppression");
        }
    };

    const handleDeleteActivite = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/activites/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
                return;
            }

            setActivites(activites.filter(activite => activite.id !== id));
        } catch {
            setError("Erreur lors de la suppression");
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Gestion des activités</h1>
                <div className="admin-actions">
                    <button 
                        onClick={() => router.push("/admin/types/new")}
                        className="admin-button"
                    >
                        Nouveau type d&#39;activité
                    </button>
                    <button 
                        onClick={() => router.push("/admin/activites/new")}
                        className="admin-button"
                    >
                        Nouvelle activité
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="admin-section">
                <h2>Types d&#39;activités</h2>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {types.map((type) => (
                            <tr key={type.id}>
                                <td>{type.nom}</td>
                                <td>
                                    <button 
                                        onClick={() => router.push(`/admin/types/${type.id}/edit`)}
                                        className="edit-button"
                                    >
                                        Modifier
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteType(type.id)}
                                        className="delete-button"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="admin-section">
                <h2>Activités</h2>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Places</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activites.map((activite) => (
                            <tr key={activite.id}>
                                <td>{activite.nom}</td>
                                <td>{types.find(t => t.id === activite.type_id)?.nom}</td>
                                <td>{activite.places_disponibles}</td>
                                <td>{new Date(activite.datetime_debut).toLocaleString()}</td>
                                <td>
                                    <button 
                                        onClick={() => router.push(`/admin/activites/${activite.id}/edit`)}
                                        className="edit-button"
                                    >
                                        Modifier
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteActivite(activite.id)}
                                        className="delete-button"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 