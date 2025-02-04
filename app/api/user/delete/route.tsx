import { getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { logout } from "@/utils/sessions";

export async function DELETE(req: Request) {
    let db = null;
    try {
        const session = await getSession();
        if (!session?.rowid) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        // Vérifier s'il y a des réservations actives
        const activeReservations = await db.get(
            "SELECT COUNT(*) as count FROM reservations WHERE user_id = ? AND etat = 1",
            session.rowid
        );

        if (activeReservations.count > 0) {
            return NextResponse.json(
                { message: "Vous avez des réservations actives. Veuillez les annuler avant de supprimer votre compte." },
                { status: 400 }
            );
        }

        // Supprimer le compte
        await db.run("DELETE FROM users WHERE rowid = ?", session.rowid);

        // Déconnexion
        await logout();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Erreur lors de la suppression du compte:", error);
        return NextResponse.json(
            { message: "Erreur lors de la suppression du compte" },
            { status: 500 }
        );
    } finally {
        if (db) await db.close();
    }
} 