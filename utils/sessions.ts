import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import * as jwt from "jsonwebtoken";

interface SessionToken {
    rowid: number;
    role: string;
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
        return null;
    }

    try {
        return jwt.verify(token.value, process.env.JWT_SECRET || "") as SessionToken;
    } catch {
        return null;
    }
}

export async function checkAuth() {
    const session = await getSession();
    
    if (!session) {
        return { status: 401, role: null };
    }

    const db = await open({
        filename: process.env.DATABASE_NAME || "",
        driver: sqlite3.Database,
    });

    const user = await db.get(
        "SELECT rowid, email, role FROM users WHERE rowid = ?",
        session.rowid
    );

    if (!user) {
        return { status: 401, role: null };
    }

    return { status: 200, role: user.role };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
}

export async function createCookie(sessionData: any) {
    const cookieStore = await cookies();
    const token = jwt.sign(sessionData, process.env.JWT_SECRET || "");
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
    });
} 