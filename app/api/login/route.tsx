"use server";

import { checkPassword } from "@/utils/bcryptjs";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { createCookie } from "@/utils/sessions";

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;

    const db = await open({
        filename: process.env.DATABASE_NAME || "",
        driver: sqlite3.Database,
    });

    // Vérifier l'utilisateur et récupérer son rôle
    const user = await db.get(
        "SELECT rowid, email, pwd, role FROM users WHERE email = ?",
        email
    );

    if (!user || !(await checkPassword(password, user.pwd))) {
        return NextResponse.json(
            { message: "Invalid credentials" },
            { status: 403 }
        );
    }

    const sessionData = { 
        rowid: user.rowid, 
        email: user.email,
        role: user.role 
    };

    await createCookie(sessionData);

    return NextResponse.json({ 
        success: true,
        role: user.role 
    });
}