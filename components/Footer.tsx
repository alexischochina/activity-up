import Link from "next/link";
import "@/styles/footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>Activity Up</h3>
                    <p>La plateforme de réservation d'activités qui vous simplifie la vie</p>
                </div>
                
                <div className="footer-section">
                    <h3>Navigation</h3>
                    <ul>
                        <li><Link href="/">Accueil</Link></li>
                        <li><Link href="/activites">Activités</Link></li>
                        <li><Link href="/login">Connexion</Link></li>
                        <li><Link href="/register">Inscription</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Contact</h3>
                    <ul>
                        <li>Email: contact@activityup.fr</li>
                        <li>Téléphone: 01 23 45 67 89</li>
                        <li>Adresse: 123 rue des Sports, Paris</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Activity Up. Tous droits réservés.</p>
            </div>
        </footer>
    );
} 