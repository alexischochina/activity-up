import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Ajouter une activité - Activity Up",
    description: "Formulaire d'ajout d'une activité.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}