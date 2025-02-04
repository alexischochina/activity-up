import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
    title: "Mon compte - Activity Up",
    description: "Description de la page mon compte",
};

export default function CompteLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            {children}
        </main>
    );
}
