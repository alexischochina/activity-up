"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "@/styles/reservations.css";

interface Reservation {
    id: number;
    date_reservation: string;
    etat: number;
    activite_nom: string;
    datetime_debut: string;
    duree: number;
    type_nom: string;
}

export default function MesReservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await fetch("/api/reservations");
            if (!response.ok) {
                setError("Erreur lors du chargement des réservations");
                return;
            }
            const data = await response.json();
            setReservations(data);
        } catch (err) {
            setError("Erreur lors du chargement des réservations");
        }
    };

    const handleCancelReservation = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
            return;
        }

        try {
            const response = await fetch(`/api/reservations/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                setError("Erreur lors de l'annulation de la réservation");
                return;
            }

            fetchReservations();
        } catch (err) {
            setError("Erreur lors de l'annulation de la réservation");
        }
    };

    return (
        <div className="reservations-container">
            <div className="reservations-box">
                <h1 className="reservations-title">Mes Réservations</h1>

                {error && <div className="error-message">{error}</div>}

                {reservations.length === 0 ? (
                    <div className="no-reservations">
                        <p>Vous n'avez pas encore de réservations.</p>
                        <Link href="/activites" className="no-reservations-link">
                            Découvrir les activités
                        </Link>
                    </div>
                ) : (
                    <div className="reservations-grid">
                        {reservations.map((reservation) => (
                            <div key={reservation.id} className="reservation-card">
                                <div className="reservation-header">
                                    <h2>{reservation.activite_nom}</h2>
                                    <span className="reservation-type">
                                        {reservation.type_nom}
                                    </span>
                                </div>
                                <div className="reservation-details">
                                    <div className="reservation-info">
                                        <span>
                                            Date : {new Date(reservation.datetime_debut).toLocaleString()}
                                        </span>
                                        <span>Durée : {reservation.duree} minutes</span>
                                        <span>
                                            Réservé le : {new Date(reservation.date_reservation).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className={`reservation-status ${reservation.etat === 1 ? 'status-active' : 'status-cancelled'}`}>
                                    {reservation.etat === 1 ? 'Réservation active' : 'Réservation annulée'}
                                </div>
                                {reservation.etat === 1 && (
                                    <button
                                        onClick={() => handleCancelReservation(reservation.id)}
                                        className="cancel-button"
                                    >
                                        Annuler la réservation
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 
