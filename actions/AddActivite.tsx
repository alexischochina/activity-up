"use server";

import { getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function addActivite(activite_name: string, activite_level: string) {
    let db = null;

    // Check if the database instance has been initialized
    if (!db) {
        // If the database instance is not initialized, open the database connection
        db = await open({
            filename: process.env.DATABASE_NAME || "", // Specify the database file path
            driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
        });
    }

    // Get the logged user
    const session = await getSession();
    // Check if the user already have this activite
    const verifSql = "SELECT rowid FROM activites WHERE activite_name = ? AND user = ?";
    const verif = await db.get(verifSql, activite_name, session.rowid);

    if (verif) {
        return NextResponse.json(
            { message: "You already have this activite" },
            { status: 403 }
        );
    }

    // Insert new activite
    const sql = `INSERT INTO activites(activite_name, level, user) VALUES(?, ?, ?)`;
    const activiteAdd = await db.run(sql, activite_name, activite_level, session.rowid);

    return NextResponse.json(activiteAdd);
}