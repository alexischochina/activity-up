"use client";

import { useEffect, useState } from "react";
import { Activite } from "../../types/Activite";
import { TypeActivite } from "@/types/TypeActivite";
import "@/styles/activites.css";
import clsx from "clsx";
import Link from "next/link";

export default function Activites() {
    const [activites, setActivites] = useState<Activite[]>([]);
    const [types, setTypes] = useState<TypeActivite[]>([]);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<string>("all");

    useEffect(() => {
        fetchActivites();
        fetchTypes();
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
        } catch {
            setError("Erreur lors du chargement des activités");
        }
    };

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
    const filteredActivites = activites.filter((activite) => {
        const matchesSearch = activite.nom.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === "all" || activite.type_id.toString() === selectedType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="page-container">
            <div className="content-box">
                <div className="page-header">
                    <h1>Activités disponibles</h1>
                    <div className="filters">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Rechercher une activité..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="type-filter"
                        >
                            <option value="all">Tous les types</option>
                            {types.map((type) => (
                                <option key={type.id} value={type.id.toString()}>
                                    {type.nom}
                                </option>
                            ))}
                        </select>
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
                            <Link 
                                href={`/activites/${activite.id}`} 
                                className={clsx('reservation-button', {
                                    disabled: activite.places_disponibles === 0,
                                })}
                            >
                                {activite.places_disponibles > 0 ? "Plus d'infos" : "Complet"}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 