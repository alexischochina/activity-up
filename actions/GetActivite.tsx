// Les actions sont exécutées côté serveur
"use server";

import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function getActivite(id: number) {
    let db = null;

    // Check if the database instance has been initialized
    if (!db) {
        // If the database instance is not initialized, open the database connection
        db = await open({
            filename: process.env.DATABASE_NAME || "", // Specify the database file path
            driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
        });
    }

    // Get one user by id
    const sql = `SELECT * FROM activites WHERE rowid = ?`;
    const user = await db.get(sql, id);

    // If no result
    if (!user) {
        return NextResponse.json({ message: "Activité pas trouvée" }, { status: 404 });
    }

    return NextResponse.json(user);
}