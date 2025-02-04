import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Activités - Activity Up",
    description: "Liste des activités disponibles",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}