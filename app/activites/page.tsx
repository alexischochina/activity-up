"use client";

import { useEffect, useState } from "react";
import { Activite } from "../../types/Activite";
import "@/styles/activites.css";
import clsx from "clsx";
import Link from "next/link";

export default function Activites() {
    const [activites, setActivites] = useState<Activite[]>([]);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchActivites();
    }, []);

    const fetchActivites = async () => {
        try {
            const response = await fetch("/api/activites");
            if (!response.ok) {
                setError("Erreur lors du chargement des activités");
                return;
            }
            const data = await response.json();
            setActivites(data);
        } catch (err) {
            setError("Erreur lors du chargement des activités");
        }
    };

    const handleReservation = async (activiteId: number) => {
        try {
            const response = await fetch("/api/reservations/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ activiteId }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || "Erreur lors de la réservation");
                return;
            }

            fetchActivites();
        } catch (err) {
            setError("Erreur lors de la réservation");
        }
    };

    const filteredActivites = activites.filter((activite) =>
        activite.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-container">
            <div className="content-box">
                <div className="page-header">
                    <h1>Activités disponibles</h1>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Rechercher une activité..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="activities-grid">
                    {filteredActivites.map((activite) => (
                        <div key={activite.id} className="activity-card">
                            <div className="activity-header">
                                <h2>{activite.nom}</h2>
                                <span className="activity-type">{activite.type_nom}</span>
                            </div>
                            <div className="activity-details">
                                <div className="activity-info">
                                    <span>Places : {activite.places_disponibles}</span>
                                    <span>Date : {new Date(activite.datetime_debut).toLocaleString()}</span>
                                    <span>Durée : {activite.duree} minutes</span>
                                </div>
                            </div>
                            <Link href={`/activites/${activite.id}`} className={clsx('reservation-button', {
                                disabled: activite.places_disponibles === 0,
                            })}>
                                {activite.places_disponibles > 0 ? "Plus d'infos" : "Complet"}
                            </Link>

                            <button
                                onClick={() => handleReservation(activite.id)}
                                className="reservation-button"
                                disabled={activite.places_disponibles === 0}
                            >
                                {activite.places_disponibles > 0 ? "Plus d'infos" : "Complet"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 