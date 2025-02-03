"use server";

import ActiviteForm from "@/components/ActiviteForm";

export default async function ActiviteAdd() {
    return (
        <>
            <h1>Ajouter une compétence</h1>
            <ActiviteForm />
        </>
    );
}