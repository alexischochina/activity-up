import { getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function POST(req: Request) {
    let db = null;
    let transactionStarted = false;
    try {
        const session = await getSession();
        if (!session?.rowid) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

        const { activiteId } = await req.json();

        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        // Vérifier si l'utilisateur a déjà réservé cette activité
        const existingReservation = await db.get(
            "SELECT rowid FROM reservations WHERE user_id = ? AND activite_id = ? AND etat = 1",
            [session.rowid, activiteId]
        );

        if (existingReservation) {
            return NextResponse.json(
                { message: "Vous avez déjà réservé cette activité" },
                { status: 400 }
            );
        }

        // Vérifier s'il reste des places et si l'activité existe
        const activite = await db.get(
            "SELECT rowid, places_disponibles FROM activites WHERE rowid = ?",
            activiteId
        );

        if (!activite) {
            return NextResponse.json(
                { message: "Activité non trouvée" },
                { status: 404 }
            );
        }

        if (activite.places_disponibles <= 0) {
            return NextResponse.json(
                { message: "Plus de places disponibles" },
                { status: 400 }
            );
        }

        // Démarrer la transaction
        await db.run("BEGIN TRANSACTION");
        transactionStarted = true;

        // Insérer la réservation
        await db.run(
            "INSERT INTO reservations (user_id, activite_id) VALUES (?, ?)",
            [session.rowid, activite.rowid]
        );

        // Mettre à jour le nombre de places disponibles
        await db.run(
            "UPDATE activites SET places_disponibles = places_disponibles - 1 WHERE rowid = ?",
            activite.rowid
        );

        await db.run("COMMIT");
        transactionStarted = false;

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (db && transactionStarted) {
            await db.run("ROLLBACK");
        }

        console.error("Erreur détaillée:", error);

        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Une erreur inconnue est survenue" }, { status: 500 });
    } finally {
        if (db) await db.close();
    }
}

export async function GET() {
    let db = null;
    try {
        const session = await getSession();
        if (!session?.rowid) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        const reservations = await db.all(`
            SELECT 
                r.rowid as id,
                r.date_reservation,
                r.etat,
                a.nom as activite_nom,
                a.description,
                a.datetime_debut,
                a.duree,
                t.nom as type_nom
            FROM reservations r
            JOIN activites a ON a.rowid = r.activite_id
            JOIN type_activite t ON t.rowid = a.type_id
            WHERE r.user_id = ? AND r.etat = 1
            ORDER BY r.date_reservation DESC
        `, session.rowid);

        return NextResponse.json(reservations);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Une erreur inconnue est survenue" }, { status: 500 });
    } finally {
        if (db) await db.close();
    }
} 