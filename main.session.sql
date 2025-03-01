CREATE TABLE IF NOT EXISTS users (
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  pwd VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  registration DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS type_activite;
CREATE TABLE type_activite (
    rowid INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(255) NOT NULL UNIQUE
);
DROP TABLE IF EXISTS activites;
CREATE TABLE activites (
    rowid INTEGER PRIMARY KEY AUTOINCREMENT,
    nom VARCHAR(255) NOT NULL,
    type_id INTEGER REFERENCES type_activite(ROWID),
    places_disponibles INTEGER NOT NULL,
    description TEXT NOT NULL,
    datetime_debut DATETIME NOT NULL,
    duree INTEGER NOT NULL
);
DROP TABLE IF EXISTS reservations;
CREATE TABLE reservations (
    rowid INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(ROWID),
    activite_id INTEGER REFERENCES activites(rowid),
    date_reservation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    etat BOOLEAN NOT NULL DEFAULT TRUE
);