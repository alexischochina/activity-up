"use server";

import { getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function addTypeActivite(type_name: string) {
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
    // Check if the user already have this activite
    const verifSql = "SELECT rowid FROM type_activite WHERE activitie_name = ?";
    const verif = await db.get(verifSql, type_name);

    if (verif) {
        return NextResponse.json(
            { message: "You already have this activite" },
            { status: 403 }
        );
    }

    // Insert new activite
    const sql = `INSERT INTO type_activite(activitie_name) VALUES(?)`;
    const typeActiviteAdd = await db.run(sql, type_name);

    return NextResponse.json(typeActiviteAdd);
}