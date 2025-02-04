import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function POST() {
    let db = null;
    try {
        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        await db.run(`
            DROP TABLE IF EXISTS reservations;
            CREATE TABLE IF NOT EXISTS reservations (
                rowid INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER REFERENCES users(ROWID),
                activite_id INTEGER REFERENCES activites(ROWID),
                date_reservation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                etat BOOLEAN NOT NULL DEFAULT TRUE
            );
        `);

        return NextResponse.json({ message: "Table réinitialisée avec succès" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Une erreur inconnue est survenue" }, { status: 500 });
    } finally {
        if (db) await db.close();
    }
} 