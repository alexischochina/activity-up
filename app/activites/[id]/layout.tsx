import { Metadata } from "next";
import React from "react";
import { getActivite } from "@/actions/GetActivite";
import { Activite } from "@/types/Activite";

export async function generateMetadata({ params }: { params: { id: number } }): Promise<Metadata> {
    const id = params.id;
    const response = await getActivite(id);

    if (!response.ok || response.status >= 300) {
        return {
            title: "Une activité - Activity Up",
            description: "Détails d'une activité",
        };
    }

    const activite: Activite = await response.json();

    return {
        title: `${activite.nom} - Activity Up`,
        description: `Détails de l'activité ${activite.nom}.`,
    };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}