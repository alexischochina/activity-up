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

        const type = await db.get(
            "SELECT rowid as id, nom FROM type_activite WHERE rowid = ?",
            params.id
        );

        if (!type) {
            return NextResponse.json(
                { message: "Type non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json(type);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Une erreur inconnue est survenue" }, { status: 500 });
    } finally {
        if (db) await db.close();
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    let db = null;
    try {
        const session = await getSession();
        if (!session?.rowid) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        // Vérifier si le type est utilisé dans des activités
        const activitesLiees = await db.get(
            "SELECT COUNT(*) as count FROM activites WHERE type_id = ?",
            params.id
        );

        if (activitesLiees.count > 0) {
            return NextResponse.json(
                { message: "Ce type est utilisé par des activités et ne peut pas être supprimé" },
                { status: 400 }
            );
        }

        await db.run("DELETE FROM type_activite WHERE rowid = ?", params.id);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Une erreur inconnue est survenue" }, { status: 500 });
    } finally {
        if (db) await db.close();
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    let db = null;
    try {
        const session = await getSession();
        if (!session?.rowid) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

        const { nom } = await req.json();

        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        await db.run(
            "UPDATE type_activite SET nom = ? WHERE rowid = ?",
            [nom, params.id]
        );

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Une erreur inconnue est survenue" }, { status: 500 });
    } finally {
        if (db) await db.close();
    }
} 