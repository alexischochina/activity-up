"use server";

import { getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function getActivites() {
    let db = null;

    // Check if the database instance has been initialized
    if (!db) {
        // If the database instance is not initialized, open the database connection
        db = await open({
            filename: process.env.DATABASE_NAME || "", // Specify the database file path
            driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
        });
    }

    // Get user logged
    const session = await getSession();

    // Get all user skills
    const sql = `SELECT rowid, skill_name, level FROM skills WHERE user = ?`;
    const skills = await db.all(sql, session.rowid);

    return NextResponse.json(skills);
}