import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "S'inscrire - Activity Up",
    description: "Inscription au site Activity Up",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}