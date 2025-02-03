"use server";

import TypeActiviteForm from "@/components/TypeActiviteForm";

export default async function TypeActiviteAdd() {
    return (
        <>
            <h1>Ajouter un type d'activité</h1>
            <TypeActiviteForm />
        </>
    );
}