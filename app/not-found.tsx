import Link from "next/link";
import "@/styles/not-found.css";

export default function NotFound() {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1>
                    <span className="error-code">404</span>
                    <span className="error-text">Page non trouvée</span>
                </h1>
                <p>Désolé, la page que vous recherchez n&#39;existe pas.</p>
                <div className="actions">
                    <Link href="/" className="home-button">
                        Retour à l&#39;accueil
                    </Link>
                    <Link href="/activites" className="activities-button">
                        Voir les activités
                    </Link>
                </div>
            </div>
        </div>
    );
}