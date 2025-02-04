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

        const activite = await db.get(`
            SELECT 
                a.rowid as id,
                a.nom,
                a.type_id,
                t.nom as type_nom,
                a.places_disponibles,
                a.description,
                a.datetime_debut,
                a.duree
            FROM activites a
            LEFT JOIN type_activite t ON t.rowid = a.type_id
            WHERE a.rowid = ?
        `, params.id);

        if (!activite) {
            return NextResponse.json(
                { message: "Activité non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json(activite);
    } catch (error: any) {
        console.error("Erreur détaillée:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    } finally {
        if (db) await db.close();
    }
} 