CREATE TABLE IF NOT EXISTS users (
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  pwd VARCHAR(255) NOT NULL,
  registration DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS type_activite (
  activitie_name VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS activites (
  activite_name VARCHAR(255) NOT NULL,
  type_id REFERENCES type_activite(ROWID),
  places_disponibles INT NOT NULL,
  activite_description VARCHAR(255) NOT NULL,
  datetime_debut DATETIME NOT NULL,
  durée INT NOT NULL
);
CREATE TABLE IF NOT EXISTS reservations (
  user_id REFERENCES users(ROWID),
  activitie_id REFERENCES activites(ROWID),
  date_reservation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  etat BOOLEAN NOT NULL DEFAULT TRUE
);