import { getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function POST(req: Request) {
    let db = null;
    try {
        console.log("Début de la requête POST");
        const session = await getSession();
        console.log("Session:", session);
        
        if (!session || !session.rowid) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        console.log("Ouverture de la base de données");
        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });
        console.log("Base de données ouverte");

        // Vérifier si l'utilisateur est admin
        console.log("Vérification du rôle admin pour l'utilisateur:", session.rowid);
        const user = await db.get(
            "SELECT role FROM users WHERE rowid = ?",
            session.rowid
        );
        console.log("Utilisateur trouvé:", user);

        if (!user || user.role !== "admin") {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 403 }
            );
        }

        const body = await req.json();
        console.log("Corps de la requête:", body);
        const { nom } = body;

        if (!nom || nom.trim() === "") {
            return NextResponse.json(
                { message: "Le nom est requis" },
                { status: 400 }
            );
        }

        // Vérifier si le type existe déjà
        console.log("Vérification si le type existe déjà:", nom.trim());
        const existingType = await db.get(
            "SELECT rowid FROM type_activite WHERE nom = ?",
            nom.trim()
        );
        console.log("Type existant:", existingType);

        if (existingType) {
            return NextResponse.json(
                { message: "Ce type d'activité existe déjà" },
                { status: 400 }
            );
        }

        // Insérer le nouveau type
        console.log("Insertion du nouveau type");
        const result = await db.run(
            "INSERT INTO type_activite (nom) VALUES (?)",
            nom.trim()
        );
        console.log("Résultat de l'insertion:", result);

        if (!result || !result.lastID) {
            throw new Error("Erreur lors de l'insertion");
        }

        return NextResponse.json({
            id: result.lastID,
            nom: nom.trim()
        });
    } catch (error: any) {
        console.error("Erreur détaillée:", error);
        console.error("Stack trace:", error.stack);
        return NextResponse.json(
            { message: "Erreur serveur", details: error.message, stack: error.stack },
            { status: 500 }
        );
    } finally {
        if (db) {
            console.log("Fermeture de la base de données");
            await db.close();
        }
    }
}

export async function GET() {
    try {
        const session = await getSession();
        
        if (!session || !session.rowid) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        const types = await db.all("SELECT rowid as id, nom FROM type_activite");

        return NextResponse.json(types);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Erreur serveur" },
            { status: 500 }
        );
    }
}

// Pour supprimer un type
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

        // Vérifier si le type est utilisé dans des activités
        const activitesLiees = await db.get(
            "SELECT COUNT(*) as count FROM activites WHERE type_id = ?",
            id
        );

        if (activitesLiees.count > 0) {
            return NextResponse.json(
                { message: "Ce type est utilisé par des activités et ne peut pas être supprimé" },
                { status: 400 }
            );
        }

        await db.run("DELETE FROM type_activite WHERE rowid = ?", id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    } finally {
        if (db) await db.close();
    }
}

// Pour modifier un type
export async function PATCH(req: Request) {
    let db = null;
    try {
        const session = await getSession();
        if (!session?.rowid) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const { nom } = await req.json();

        db = await open({
            filename: process.env.DATABASE_NAME || "",
            driver: sqlite3.Database,
        });

        await db.run(
            "UPDATE type_activite SET nom = ? WHERE rowid = ?",
            [nom, id]
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    } finally {
        if (db) await db.close();
    }
} 