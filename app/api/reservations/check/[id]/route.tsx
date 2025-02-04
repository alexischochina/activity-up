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

        const reservation = await db.get(
            "SELECT rowid FROM reservations WHERE user_id = ? AND activite_id = ? AND etat = 1",
            [session.rowid, params.id]
        );

        return NextResponse.json({ isReserved: !!reservation });
    } catch (error: any) {
        console.error("Erreur détaillée:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    } finally {
        if (db) await db.close();
    }
} 