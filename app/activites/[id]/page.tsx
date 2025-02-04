"use client";

import { Activite } from "@/types/Activite";
import { useEffect, useState, use } from "react";
import "@/styles/activites.css";
import clsx from "clsx";

export default function ActiviteDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // Unwrap params correctly

    const [activite, setActivite] = useState<Activite | null>(null);
    const [error, setError] = useState("");
    const [isReserved, setIsReserved] = useState(false);

    useEffect(() => {
        fetchActivite();
        checkReservation();
    }, []);

    const fetchActivite = async () => {
        try {
            const response = await fetch(`/api/activites/${id}`);
            if (!response.ok) {
                setError("Erreur lors du chargement de l'activité");
                return;
            }
            const data = await response.json();
            setActivite(data);
        } catch {
            setError("Erreur lors du chargement de l'activité");
        }
    };

    const checkReservation = async () => {
        try {
            const response = await fetch(`/api/reservations/check/${id}`);
            if (response.ok) {
                const data = await response.json();
                setIsReserved(data.isReserved);
            }
        } catch (err) {
            console.error("Erreur lors de la vérification de la réservation:", err);
        }
    };

    const handleReservation = async () => {
        try {
            const response = await fetch("/api/reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ activiteId: Number(id) }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || "Erreur lors de la réservation");
                return;
            }

            setIsReserved(true);
            fetchActivite();
        } catch {
            setError("Erreur lors de la réservation");
        }
    };

    if (!activite) {
        return (
            <div className="page-container">
                <div className="content-box">
                    {error ? <div className="error-message">{error}</div> : "Chargement..."}
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="content-box">
                <h1>{activite.nom}</h1>
                <br />
                <div className="time-container">
                    <span>{new Date(activite.datetime_debut).toLocaleString()}</span>
                    <span>{activite.duree} minutes</span>
                </div>
                <br />
                <div>{activite.places_disponibles} {activite.places_disponibles > 1 ? "places disponibles" : "place disponible"}</div>
                <br />
                <p className="activity-description">{activite.description}</p>
                <br />
                <span className="activity-type">{activite.type_nom}</span>
                <br />
                <br />
                {error && <div className="error-message">{error}</div>}
                <button
                    onClick={handleReservation}
                    className={clsx("reservation-button", {
                        reserved: isReserved,
                    })}
                    disabled={activite.places_disponibles === 0 || isReserved}
                >
                    {isReserved ? "Réservé" : activite.places_disponibles > 0 ? "Réserver" : "Complet"}
                </button>
            </div>
        </div>
    );
}