import { getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    let db = null;
    try {
        const session = await getSession();
        if (!session?.rowid) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        const activite = await db.get(
            `SELECT 
                rowid as id,
                nom,
                type_id,
                places_disponibles,
                description,
                datetime_debut,
                duree
            FROM activites 
            WHERE rowid = ?`,
            params.id
        );

        if (!activite) {
            return NextResponse.json(
                { message: "Activité non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json(activite);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    } finally {
        if (db) await db.close();
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    let db = null;
    try {
        const session = await getSession();
        if (!session?.rowid) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

        const { nom, type_id, places_disponibles, description, datetime_debut, duree } = await req.json();

        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        await db.run(
            `UPDATE activites 
            SET nom = ?, type_id = ?, places_disponibles = ?, 
                description = ?, datetime_debut = ?, duree = ?
            WHERE rowid = ?`,
            [nom, type_id, places_disponibles, description, datetime_debut, duree, params.id]
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    } finally {
        if (db) await db.close();
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    let db = null;
    try {
        const session = await getSession();
        if (!session?.rowid) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        // Vérifier s'il y a des réservations
        const reservations = await db.get(
            "SELECT COUNT(*) as count FROM reservations WHERE activite_id = ?",
            params.id
        );

        if (reservations.count > 0) {
            return NextResponse.json(
                { message: "Cette activité a des réservations et ne peut pas être supprimée" },
                { status: 400 }
            );
        }

        await db.run("DELETE FROM activites WHERE rowid = ?", params.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    } finally {
        if (db) await db.close();
    }
} 