"use client";

import { Activite } from "@/types/Activite";
import { useEffect, useState } from "react";

export default function ActiviteClient() {
    const [activitesList, setActivitesList] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Catch delete action
    const handleDelete = (activite: Activite) => {
        deleteActivite(activite.rowid);
    };

    // Execute deletion
    const deleteActivite = async (activite_id: number | undefined) => {
        // Call API with DELETE method
        const response = await fetch(`/api/activites/delete/${activite_id}`, {
            method: "DELETE",
        });

        if (!response.ok || response.status >= 300) {
            setError("Une erreur est survenue");
            return;
        }

        // Update state with filter method to delete the row
        setActivitesList((prevList) =>
            prevList.filter((activite: Activite) => activite.rowid !== activite_id)
        );
    };

    const getActivites = async () => {
        const response = await fetch("/api/activites");

        if (!response.ok || response.status >= 300) {
            setError("Une erreur est survenue");
            return;
        }

        const activites = await response.json();

        // We need to keep in state the data only, not the HTML to easily delete the row later
        setActivitesList(activites.response);
        setIsLoading(false);
    };

    useEffect(() => {
        getActivites();
    }, []);

    return (
        <>
            {error && <p>{error}</p>}
            {isLoading ? (
                <p>Chargement des compétences</p>
            ) : activitesList.length > 0 ? (
                activitesList.map((activite: Activite, i: number) => {
                    return (
                        <p key={i}>
                            {activite.activite_name} : {activite.level}/5{" "}
                            <button onClick={() => handleDelete(activite)}>Supprimer</button>
                        </p>
                    );
                })
            ) : (
                <p>Aucune compétence associée à ce profil</p>
            )}
        </>
    );
}