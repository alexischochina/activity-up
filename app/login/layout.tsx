import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Se connecter - Activity Up",
    description: "Connexion à son compte Activity Up",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}