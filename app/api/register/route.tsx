"use server";

import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function POST(req: Request) {
    // Get body request
    const body = await req.json();
    const { firstname, lastname, email, password } = body;

    let db = null;

    if (!db) {
        // If the database instance is not initialized, open the database connection
        db = await open({
            filename: process.env.DATABASE_NAME || "", // Specify the database file path
            driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
        });
    }

    // Verify that the user does not exist yet
    const verif = `SELECT rowid FROM users WHERE email = ?`;
    const userVerif = await db.get(verif, email);

    if (userVerif) {
        // Return an appropriate error message
        return NextResponse.json(
            { message: "Cet email est déjà utilisé" },
            { status: 403 }
        );
    }

    // Insert the new user with default role "user"
    const sql = `INSERT INTO users(firstname, lastname, email, pwd, role) VALUES(?, ?, ?, ?, ?)`;
    const userAdd = await db.run(sql, firstname, lastname, email, password, "admin");

    return NextResponse.json(userAdd);
}