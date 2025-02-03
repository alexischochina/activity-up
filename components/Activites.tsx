import { getActivites } from "@/actions/GetActivites";
import { Activite } from "@/types/Activite";

export default async function Activites() {
    const response = await getActivites(); // Call API

    if (!response.ok || response.status >= 300) {
        return <p>Une erreur est survenue</p>;
    }

    const activites = await response.json();

    // Show all activites
    return activites.map((activite: Activite, i: number) => {
        return (
            <p key={i}>
                {activite.activite_name} : {activite.level}/5
            </p>
        );
    });
}