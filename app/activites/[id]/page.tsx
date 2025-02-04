"use server";

import {Activite} from "@/types/Activite";
import {getActivite} from "@/actions/GetActivite";
import "@/styles/activites.css";
import {getTypeActivite} from "@/actions/GetTypeActivite";
import {TypeActivite} from "@/types/TypeActivite";

export default async function findOneActivite({
                                                  // Récupération des paramètres d'URL
                                                  params,
                                              }: {
    // Typage des paramètres d'URL
    params: Promise<{ id: number }>;
}) {
    // Récupération de l'id parmi les paramètres d'URL
    const id = (await params).id;
    // Appel de l'action
    const response = await getActivite(id);

    if (!response.ok || response.status >= 300) {
        // S'il y a une erreur
        try {
            // On récupère le message d'erreur
            const {message} = await response.json();
            return <p>{message}</p>;
        } catch (e) {
            console.error(e);
        }
        // Si la récupération du message d'erreur à échoué,
        // on affiche un message par défaut
        return <p>Une erreur est survenue</p>;
    }

    // On récupère l'utilisateur renvoyé par l'action
    const activite: Activite = await response.json();

    const respType = await getTypeActivite(activite.type_id)
    const typeActivite: TypeActivite = await respType.json();

    return (
        <div className='page-container'>
            <div className="content-box">
                <h1>{activite.nom}</h1>
                <br/>
                <div className="time-container">
                    <span>{new Date(activite.datetime_debut).toLocaleString()}</span>
                    <span>{activite.duree} minutes</span>
                </div>
                <br/>
                <div>{activite.places_disponibles} {activite.places_disponibles > 1 ? "places disponibles" : "place disponible"}</div>
                <br/>
                <p className="activity-description">{activite.description}</p>
                <br/>
                <span className="activity-type">{typeActivite.nom}</span>
            </div>
        </div>
    );
}