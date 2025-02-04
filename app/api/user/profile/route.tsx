import { getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function GET() {
    try {
        const session = await getSession();
        if (!session?.rowid) {
            return NextResponse.json(null, { status: 401 });
        }

        const db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        const user = await db.get(
            "SELECT rowid, firstname, lastname, email, role FROM users WHERE rowid = ?",
            session.rowid
        );

        await db.close();

        if (!user) {
            return NextResponse.json(null, { status: 401 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(null, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getSession();
        
        if (!session || !session.rowid) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { firstname, lastname, email } = body;

        const db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        const existingUser = await db.get(
            "SELECT rowid FROM users WHERE email = ? AND rowid != ?",
            [email, session.rowid]
        );

        if (existingUser) {
            return NextResponse.json(
                { message: "Cet email est déjà utilisé" },
                { status: 400 }
            );
        }

        // Mettre à jour l'utilisateur
        await db.run(
            "UPDATE users SET firstname = ?, lastname = ?, email = ? WHERE rowid = ?",
            [firstname, lastname, email, session.rowid]
        );

        // Récupérer les informations mises à jour
        const updatedUser = await db.get(
            "SELECT firstname, lastname, email FROM users WHERE rowid = ?",
            session.rowid
        );

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Erreur serveur" },
            { status: 500 }
        );
    }
} 