import { getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function POST(req: Request) {
    let db = null;
    try {
        const session = await getSession();
        
        if (!session || !session.rowid) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        // Vérifier si l'utilisateur est admin
        const user = await db.get(
            "SELECT role FROM users WHERE rowid = ?",
            session.rowid
        );

        if (!user || user.role !== "admin") {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 403 }
            );
        }

        const { nom, type_id, places_disponibles, description, datetime_debut, duree } = await req.json();

        // Vérifier si le type existe
        const typeExists = await db.get(
            "SELECT rowid FROM type_activite WHERE rowid = ?",
            type_id
        );

        if (!typeExists) {
            return NextResponse.json(
                { message: "Type d'activité invalide" },
                { status: 400 }
            );
        }

        // Insérer la nouvelle activité
        const result = await db.run(
            `INSERT INTO activites (
                nom, 
                type_id, 
                places_disponibles, 
                description, 
                datetime_debut, 
                duree
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [nom, type_id, places_disponibles, description, datetime_debut, duree]
        );

        if (!result || !result.lastID) {
            throw new Error("Erreur lors de l'insertion");
        }

        // Récupérer l'activité créée
        const newActivite = await db.get(
            `SELECT 
                rowid as id,
                nom,
                type_id,
                places_disponibles,
                description,
                datetime_debut,
                duree
            FROM activites 
            WHERE rowid = ?`,
            result.lastID
        );

        return NextResponse.json(newActivite);
    } catch (error: unknown) {
        console.error("Erreur détaillée:", error);
        if (error instanceof Error) {
            return NextResponse.json({message: error.message}, {status: 500});
        }
        return NextResponse.json({message: "Une erreur inconnue est survenue"}, {status: 500});
    } finally {
        if (db) {
            await db.close();
        }
    }
}

export async function GET() {
    let db = null;
    try {
        const session = await getSession();
        
        if (!session || !session.rowid) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        const activites = await db.all(`
            SELECT 
                a.rowid as id,
                a.nom,
                a.type_id,
                t.nom as type_nom,
                a.places_disponibles,
                a.description,
                a.datetime_debut,
                a.duree
            FROM activites a
            LEFT JOIN type_activite t ON t.rowid = a.type_id
        `);

        return NextResponse.json(activites);
    } catch (error: unknown) {
        console.error("Erreur détaillée:", error);

        if (error instanceof Error) {
            return NextResponse.json({message: error.message}, {status: 500});
        }

        return NextResponse.json({message: "Une erreur inconnue est survenue"}, {status: 500});
    } finally {
        if (db) {
            await db.close();
        }
    }
}

// Pour supprimer une activité
export async function DELETE(req: Request) {
    let db = null;
    try {
        const session = await getSession();
        if (!session?.rowid) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        // Vérifier s'il y a des réservations
        const reservations = await db.get(
            "SELECT COUNT(*) as count FROM reservations WHERE activite_id = ?",
            id
        );

        if (reservations.count > 0) {
            return NextResponse.json(
                { message: "Cette activité a des réservations et ne peut pas être supprimée" },
                { status: 400 }
            );
        }

        await db.run("DELETE FROM activites WHERE rowid = ?", id);
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

// Pour modifier une activité
export async function PATCH(req: Request) {
    let db = null;
    try {
        const session = await getSession();
        if (!session?.rowid) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const { nom, type_id, places_disponibles, description, datetime_debut, duree } = await req.json();

        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        await db.run(
            `UPDATE activites 
            SET nom = ?, type_id = ?, places_disponibles = ?, 
                description = ?, datetime_debut = ?, duree = ?
            WHERE rowid = ?`,
            [nom, type_id, places_disponibles, description, datetime_debut, duree, id]
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