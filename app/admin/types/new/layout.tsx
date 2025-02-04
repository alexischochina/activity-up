import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Ajouter un nouveau type d'activité - Activity Up",
    description: "Formulaire d'ajout d'un type d'activité.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}