"use server";

import { NextRequest, NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function DELETE(
    req: NextRequest,
    {
        params,
    }: {
        params: Promise<{ id: string }>;
    }
) {
    // Get the id from params
    const id = (await params).id;

    // Call deleteActivite function (see below)
    const response = await deleteActivite(id);

    return NextResponse.json({ response });
}

async function deleteActivite(activite_id: string) {
    let db = null;

    // Check if the database instance has been initialized
    if (!db) {
        // If the database instance is not initialized, open the database connection
        db = await open({
            filename: process.env.DATABASE_NAME || "", // Specify the database file path
            driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
        });
    }

    const sql = "DELETE FROM activites WHERE ROWID = ?";
    const deleteActivite = await db.run(sql, activite_id);

    return deleteActivite;
}