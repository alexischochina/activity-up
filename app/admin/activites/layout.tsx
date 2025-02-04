import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Gestionnaire des activités - Activity Up",
    description: "Gestion des activités disponibles",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}