"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function EditActivite() {
    const [types, setTypes] = useState<TypeActivite[]>([]);
    const [formData, setFormData] = useState<Activite>({
        id: 0,
        nom: "",
        type_id: 0,
        places_disponibles: 0,
        description: "",
        datetime_debut: "",
        duree: 0,
    });
    const [error, setError] = useState("");
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Charger les types d'activités
                const typesResponse = await fetch("/api/admin/types");
                if (!typesResponse.ok) {
                    setError("Erreur lors du chargement des types d'activités");
                    return;
                }
                const typesData = await typesResponse.json();
                setTypes(typesData);

                // Charger l'activité
                const activiteResponse = await fetch(`/api/admin/activites/${id}`);
                if (!activiteResponse.ok) {
                    setError("Erreur lors du chargement de l'activité");
                    return;
                }
                const activiteData = await activiteResponse.json();

                // Formater la date pour l'input datetime-local
                const date = new Date(activiteData.datetime_debut);
                const formattedDate = date.toISOString().slice(0, 16);

                setFormData({
                    ...activiteData,
                    datetime_debut: formattedDate
                });
            } catch {
                setError("Erreur lors du chargement des données");
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/admin/activites/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    type_id: parseInt(formData.type_id.toString()),
                    places_disponibles: parseInt(formData.places_disponibles.toString()),
                    duree: parseInt(formData.duree.toString()),
                }),
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
                    <h1>Modifier l&#39;activité</h1>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label htmlFor="nom">Nom de l&#39;activité</label>
                        <input
                            type="text"
                            id="nom"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type_id">Type d&#39;activité</label>
                        <select
                            id="type_id"
                            name="type_id"
                            value={formData.type_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Sélectionnez un type</option>
                            {types.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.nom}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="places_disponibles">Nombre de places</label>
                        <input
                            type="number"
                            id="places_disponibles"
                            name="places_disponibles"
                            value={formData.places_disponibles}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="datetime_debut">Date et heure de début</label>
                        <input
                            type="datetime-local"
                            id="datetime_debut"
                            name="datetime_debut"
                            value={formData.datetime_debut}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="duree">Durée (en minutes)</label>
                        <input
                            type="number"
                            id="duree"
                            name="duree"
                            value={formData.duree}
                            onChange={handleChange}
                            min="1"
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