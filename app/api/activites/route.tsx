"use server";

import { getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function GET() {
    let db = null;
    try {
        const session = await getSession();
        if (!session?.rowid) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        const activites = await db.all(`
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
            WHERE a.datetime_debut > datetime('now')
            ORDER BY a.datetime_debut ASC
        `);

        return NextResponse.json(activites);
    } catch (error: any) {
        console.error("Erreur détaillée:", error);
        return NextResponse.json(
            { message: "Erreur serveur", details: error.message },
            { status: 500 }
        );
    } finally {
        if (db) await db.close();
    }
}