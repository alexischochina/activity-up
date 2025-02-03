import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
    title: "Activity Up - Mon compte",
    description: "Description de la page mon compte",
};

export default function CompteLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <Header />
            {children}
        </main>
    );
}
