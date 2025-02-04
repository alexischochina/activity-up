import { getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    let db = null;
    try {
        const session = await getSession();
        if (!session?.rowid) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        // Vérifier que la réservation appartient à l'utilisateur
        const reservation = await db.get(
            "SELECT activite_id FROM reservations WHERE rowid = ? AND user_id = ? AND etat = 1",
            [params.id, session.rowid]
        );

        if (!reservation) {
            return NextResponse.json(
                { message: "Réservation non trouvée" },
                { status: 404 }
            );
        }

        await db.run("BEGIN TRANSACTION");

        // Mettre à jour l'état de la réservation
        await db.run(
            "UPDATE reservations SET etat = 0 WHERE rowid = ?",
            params.id
        );

        // Remettre à jour le nombre de places disponibles
        await db.run(
            "UPDATE activites SET places_disponibles = places_disponibles + 1 WHERE rowid = ?",
            reservation.activite_id
        );

        await db.run("COMMIT");

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Erreur serveur:", error);
            if (db) await db.run("ROLLBACK");
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Une erreur inconnue est survenue" }, { status: 500 });
    } finally {
        if (db) await db.close();
    }
} 