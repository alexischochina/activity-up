"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/sessions";
import "@/styles/header.css";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { isAdmin, isLoggedIn, updateAuth } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            updateAuth(false, false);
            router.push("/login");
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    return (
        <nav className="header">
            <div className="header-container">
                <div className="header-left">
                    <Link href="/" className="logo-link">
                        <span className="logo-text">Activity<span className="logo-highlight">Up</span></span>
                    </Link>
                    <Link
                        href="/activites"
                        className={`nav-link ${pathname === "/activites" ? "active" : ""}`}
                    >
                        Activités
                    </Link>
                    {isLoggedIn && (
                        <Link
                            href="/mon-compte"
                            className={`nav-link ${pathname === "/mon-compte" ? "active" : ""}`}
                        >
                            Mon compte
                        </Link>
                    )}
                    {isAdmin && (
                        <Link
                            href="/admin/activites"
                            className={`nav-link ${pathname.includes("/admin/activites") ? "active" : ""}`}
                        >
                            Gestion des activités
                        </Link>
                    )}
                    {isLoggedIn && (
                        <Link
                            href="/mes-reservations"
                            className={`nav-link ${pathname === "/mes-reservations" ? "active" : ""}`}
                        >
                            Mes réservations
                        </Link>
                    )}
                </div>
                <div className="header-right">
                    {isAdmin && <span className="admin-tag">Admin</span>}
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="logout-button">
                            Déconnexion
                        </button>
                    ) : (
                        <Link href="/login" className="login-button">
                            Connexion
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}