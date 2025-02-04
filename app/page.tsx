import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                {/* Section Hero */}
                <div className={styles.hero}>
                    <h1 className={styles.title}>
                        Bienvenue sur <span className={styles.highlight}>Activity Up</span>
                    </h1>
                    <p className={styles.description}>
                        Découvrez et réservez des activités sportives et de loisirs en quelques clics
                    </p>
                    <div className={styles.cta}>
                        <Link href="/activites" className={styles.ctaButton}>
                            Découvrir les activités
                        </Link>
                    </div>
                </div>

                {/* Section Caractéristiques */}
                <div className={styles.features}>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>🎯</div>
                        <h3>Activités Variées</h3>
                        <p>Sports, loisirs, bien-être : trouvez l'activité qui vous correspond</p>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>📅</div>
                        <h3>Réservation Simple</h3>
                        <p>Réservez en quelques clics et gérez facilement vos activités</p>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>👥</div>
                        <h3>Communauté Active</h3>
                        <p>Rejoignez une communauté passionnée et dynamique</p>
                    </div>
                </div>

                {/* Section Comment ça marche */}
                <div className={styles.howItWorks}>
                    <h2>Comment ça marche ?</h2>
                    <div className={styles.steps}>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>1</div>
                            <h3>Inscrivez-vous</h3>
                            <p>Créez votre compte en quelques secondes</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>2</div>
                            <h3>Choisissez</h3>
                            <p>Parcourez notre catalogue d'activités</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>3</div>
                            <h3>Réservez</h3>
                            <p>Confirmez votre participation en un clic</p>
                        </div>
                    </div>
                </div>

                {/* Section Avantages */}
                <div className={styles.benefits}>
                    <div className={styles.benefitCard}>
                        <h3>Pour les Participants</h3>
                        <ul>
                            <li>Réservation instantanée</li>
                            <li>Rappels automatiques</li>
                            <li>Historique des activités</li>
                            <li>Annulation flexible</li>
                        </ul>
                    </div>
                    <div className={styles.benefitCard}>
                        <h3>Pour les Organisateurs</h3>
                        <ul>
                            <li>Gestion simplifiée</li>
                            <li>Suivi des inscriptions</li>
                            <li>Statistiques détaillées</li>
                            <li>Support dédié</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
