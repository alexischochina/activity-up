import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwt(token: string) {
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64').toString('ascii');
    return JSON.parse(payload);
}

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');
    console.log('Session cookie:', sessionCookie?.value);

    // Routes qui nécessitent une authentification
    if (request.nextUrl.pathname.startsWith('/mon-compte') || 
        request.nextUrl.pathname.startsWith('/mes-reservations')) {
        if (!sessionCookie) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Routes admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!sessionCookie) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const session = parseJwt(sessionCookie.value);
            console.log('Session parsed:', session);
            // Vérifie si l'utilisateur est admin
            if (session.role !== "admin") {
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (error) {
            console.error('Parse error:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

// Configure les chemins sur lesquels le middleware doit s'exécuter
export const config = {
    matcher: ['/admin/:path*', '/mon-compte/:path*', '/mes-reservations/:path*']
};