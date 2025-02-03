"use server";

import { getUser } from "@/actions/GetUser";
import { User } from "@/types/User";

export default async function findOneUser({
                                              // Récupération des paramètres d'URL
                                              params,
                                          }: {
    // Typage des paramètres d'URL
    params: Promise<{ id: number }>;
}) {
    // Récupération de l'id parmi les paramètres d'URL
    const id = (await params).id;
    // Appel de l'action
    const response = await getUser(id);

    if (!response.ok || response.status >= 300) {
        // S'il y a une erreur
        try {
            // On récupère le message d'erreur
            const { message } = await response.json();
            return <p>{message}</p>;
        } catch (e) {
            console.error(e);
        }
        // Si la récupération du message d'erreur à échoué,
        // on affiche un message par défaut
        return <p>Une erreur est survenue</p>;
    }

    // On récupère l'utilisateur renvoyé par l'action
    const user: User = await response.json();

    return (
        <p>
            {user.firstname} {user.lastname} : {user.email}
        </p>
    );
}