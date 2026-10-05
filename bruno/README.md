# Collection API Bruno - Instant Jobs

Documentation technique de la collection Bruno pour tester et valider l'API REST Instant Jobs.

## Qu'est-ce que Bruno ?

Bruno est un client API open-source leger et rapide, alternative a Postman ou Insomnia.
Contrairement aux outils traditionnels bases sur le cloud :
- Les requetes et environnements sont stockes sous forme de fichiers texte (YAML) directement dans le depot Git sous le dossier `bruno/`.
- Aucun compte ni synchronisation externe n'est requis.
- La collection peut etre executee via l'application graphique Bruno ou en ligne de commande via Bruno CLI (`@usebruno/cli`).

## Configuration et Prerequis

### 1. Prerequis
- Le backend Instant Jobs doit etre demarre et accessible (ex: `http://localhost:3000`).
- Bruno installe sur votre poste (application de bureau) ou la CLI installee mondialement :
  ```bash
  npm install -g @usebruno/cli
  ```

### 2. Configurer l'environnement

A la racine du dossier `bruno/`, copiez le fichier d'exemple :

```bash
cd bruno
cp .env.dist .env
```

Contenu type de `bruno/.env` :
```env
API_URL=http://localhost:3000
API_VERSION=v1
```

Dans l'application Bruno :
1. Ouvrez Bruno et selectionnez "Open Collection".
2. Choisissez le dossier `bruno/` du depot.
3. Selectionnez l'environnement `dev` (configure via `environments/dev.yml`).
   Les variables resolues sont :
   - `BASE_URL` : pointe vers `API_URL`
   - `VERSION` : pointe vers `API_VERSION`
   - `URL` : `{{BASE_URL}}/{{VERSION}}` (ex: `http://localhost:3000/v1`)

## Authentification et Sessions

L'API utilise une authentification securisee par cookie HTTP-Only (`token`) contenant un jeton JWT :
1. **Connexion** : Executez d'abord la requete `POST {{URL}}/user/login` avec les identifiants d'un utilisateur actif.
2. **Gestion automatique des cookies** : Bruno capture automatiquement le cookie de session renvoye par le serveur et l'inclut dans toutes les requetes suivantes grace au parametre `auth: inherit`.
3. **Verification de session** : La requete `GET {{URL}}/user/me` permet de valider le profil connecte.
4. **Deconnexion** : La requete `POST {{URL}}/user/logout` supprime le cookie de session.

Identifiants issus du seeder de developpement (`load-data.seeder.ts`) :
- Mot de passe commun : `Azerty1234*&`
- Administrateur : `contact@lamanu.fr` (ou compte staff/admin de l'organisation)
- Etudiant : adresse email d'un etudiant seedé (ex: `jean.dupont.1@technova.fr`)

## Panorama des Routes et Utilisation

L'ensemble des routes ci-dessous est prefixe par la variable `{{URL}}` (correspondant a `/v1`).

### 1. Utilisateurs (`/user`)

Dossier : `bruno/user/`

| Fichier Bruno | Methode | Endpoint | Role minimal requis | Description |
|---|---|---|---|---|
| `login.yml` | POST | `/user/login` | Public | Authentification email/mot de passe et emission du cookie de session. Rate limite. |
| `logout.yml` | POST | `/user/logout` | Public | Deconnexion et suppression du cookie HTTP-Only. |
| `getAuth.yml` | GET | `/user/me` | Public | Renvoie l'utilisateur connecte ou null si aucune session active. |
| `getOne.yml` | GET | `/user/:id` | Authentifie | Recupere les informations detaillees d'un utilisateur par son ID. |
| `create.yml` | POST | `/user` | ADMIN, STAFF | Creation d'un nouvel utilisateur (etudiant, staff ou admin). |
| `update.yml` | PATCH | `/user/:id` | Authentifie (Proprietaire ou ADMIN/STAFF) | Mise a jour des informations d'un utilisateur. Un etudiant ne peut modifier que son propre compte. |
| `delete.yml` | DELETE | `/user/:id` | ADMIN, STAFF | Suppression definitive d'un compte utilisateur. |
| `getMedias.yml` | GET | `/user/:userId/medias` | Authentifie (Proprietaire ou ADMIN/STAFF) | Recupere les documents et pieces jointes associes a l'utilisateur. |
| `getApplications.yml` | GET | `/user/:userId/applications` | Authentifie (Proprietaire ou ADMIN/STAFF) | Recupere toutes les candidatures deposees par l'etudiant. |
| `getAppointmentsByUser.yml` | GET | `/user/:userId/appointments` | Authentifie (Proprietaire ou ADMIN/STAFF) | Recupere tous les entretiens programmes pour cet utilisateur. |

### 2. Organisations (`/organization`)

Dossier : `bruno/organization/`

| Fichier Bruno | Methode | Endpoint | Role minimal requis | Description |
|---|---|---|---|---|
| `getAll.yml` | GET | `/organization` | Authentifie | Liste l'ensemble des ecoles et entreprises enregistrees. |
| `getOne.yml` | GET | `/organization/:id` | Authentifie | Retourne les details d'une organisation specifique. |
| `create.yml` | POST | `/organization` | ADMIN | Creation d'une nouvelle ecole ou entreprise partenaire. |
| `update.yml` | PATCH | `/organization/:id` | ADMIN | Modification des coordonnees ou informations d'une organisation. |
| `delete.yml` | DELETE | `/organization/:id` | ADMIN | Suppression d'une organisation. |
| `getCampuses.yml` | GET | `/organization/:id/campuses` | Authentifie | Liste tous les campus rattaches a une ecole. |
| `getUsers.yml` | GET | `/organization/:id/users` | Authentifie | Liste tous les membres (etudiants, staff) associes a l'organisation. |

### 3. Campus (`/campus`)

Dossier : `bruno/campus/`

| Fichier Bruno | Methode | Endpoint | Role minimal requis | Description |
|---|---|---|---|---|
| `getOne.yml` | GET | `/campus/:id` | Authentifie | Details d'un campus (nom, organisation parente). |
| `create.yml` | POST | `/campus` | ADMIN | Creation d'un nouveau campus rattache a une ecole. |
| `update.yml` | PATCH | `/campus/:id` | ADMIN, STAFF | Modification du nom ou des attributs d'un campus. |
| `delete.yml` | DELETE | `/campus/:id` | ADMIN | Suppression d'un campus. |
| `getPromotions.yml` | GET | `/campus/:id/promotions` | Authentifie | Liste les promotions enseignees sur ce campus. |

### 4. Promotions (`/promotion`)

Dossier : `bruno/promotion/`

| Fichier Bruno | Methode | Endpoint | Role minimal requis | Description |
|---|---|---|---|---|
| `getOne.yml` | GET | `/promotion/:id` | Authentifie | Details d'une promotion specifique. |
| `create.yml` | POST | `/promotion` | ADMIN, STAFF | Creation d'une promotion au sein d'un campus. |
| `update.yml` | PATCH | `/promotion/:id` | ADMIN, STAFF | Mise a jour des informations d'une promotion. |
| `delete.yml` | DELETE | `/promotion/:id` | ADMIN, STAFF | Suppression d'une promotion. |
| `getSpecialities.yml` | GET | `/promotion/:id/specialities` | Authentifie | Liste les filieres et specialites ouvertes dans cette promotion. |

### 5. Specialites (`/speciality`)

Dossier : `bruno/speciality/`

| Fichier Bruno | Methode | Endpoint | Role minimal requis | Description |
|---|---|---|---|---|
| `getOne.yml` | GET | `/speciality/:id` | Authentifie | Details d'une filiere d'etudes. |
| `create.yml` | POST | `/speciality` | ADMIN, STAFF | Ajout d'une specialite a une promotion. |
| `update.yml` | PATCH | `/speciality/:id` | ADMIN, STAFF | Modification d'une specialite existante. |
| `delete.yml` | DELETE | `/speciality/:id` | ADMIN, STAFF | Suppression d'une specialite. |
| `getSubSpecialities.yml` | GET | `/speciality/:id/sub-specialities` | Authentifie | Liste les sous-specialites ou options associees. |

### 6. Sous-Specialites (`/sub-speciality`)

Dossier : `bruno/subSpeciality/`

| Fichier Bruno | Methode | Endpoint | Role minimal requis | Description |
|---|---|---|---|---|
| `getOne.yml` | GET | `/sub-speciality/:id` | Authentifie | Details d'une sous-specialisation. |
| `create.yml` | POST | `/sub-speciality` | ADMIN, STAFF | Creation d'une option ou sous-specialisation. |
| `update.yml` | PATCH | `/sub-speciality/:id` | ADMIN, STAFF | Mise a jour d'une sous-specialisation. |
| `delete.yml` | DELETE | `/sub-speciality/:id` | ADMIN, STAFF | Suppression d'une sous-specialisation. |

### 7. Candidatures (`/application`)

Dossier : `bruno/application/`

| Fichier Bruno | Methode | Endpoint | Role minimal requis | Description |
|---|---|---|---|---|
| `getOne.yml` | GET | `/application/:id` | Authentifie | Details d'une candidature (poste, entreprise, statut, relance). |
| `create.yml` | POST | `/application` | Authentifie (Proprietaire ou ADMIN/STAFF) | Creation d'une candidature pour un etudiant (stage ou alternance). |
| `update.yml` | PATCH | `/application/:id` | Authentifie (Proprietaire ou ADMIN/STAFF) | Mise a jour du statut (`pending`, `accepted`, `refused`) ou des details. |
| `delete.yml` | DELETE | `/application/:id` | Authentifie (Proprietaire ou ADMIN/STAFF) | Suppression d'une candidature. |
| `getAppointmentsByApplication.yml` | GET | `/application/:id/appointments` | Authentifie | Liste tous les entretiens programmes pour cette candidature. |

### 8. Rendez-vous et Entretiens (`/appointment`)

Dossier : `bruno/appointment/`

| Fichier Bruno | Methode | Endpoint | Role minimal requis | Description |
|---|---|---|---|---|
| `getOne.yml` | GET | `/appointment/:id` | Authentifie (Proprietaire ou ADMIN/STAFF) | Consultation d'un entretien planifie. |
| `create.yml` | POST | `/appointment` | Authentifie (Proprietaire ou ADMIN/STAFF) | Planification d'un entretien lie a une candidature et a un etudiant. |
| `update.yml` | PATCH | `/appointment/:id` | Authentifie (Proprietaire ou ADMIN/STAFF) | Modification de la date, du motif ou du statut (`incoming`, `canceled`, `finished`). |
| `delete.yml` | DELETE | `/appointment/:id` | Authentifie (Proprietaire ou ADMIN/STAFF) | Annulation ou suppression d'un rendez-vous. |

### 9. Medias et Pieces Jointes (`/media`)

Dossier : `bruno/media/`

| Fichier Bruno | Methode | Endpoint | Role minimal requis | Description |
|---|---|---|---|---|
| `getOne.yml` | GET | `/media/:id` | Authentifie (Proprietaire ou ADMIN/STAFF) | Recuperation des metadonnees et de la charge Base64 d'un document. |
| `create.yml` | POST | `/media` | Authentifie (Proprietaire ou ADMIN/STAFF) | Enregistrement d'un document (CV, lettre). Charge maximale : 10 Mo. |
| `update.yml` | PATCH | `/media/:id` | Authentifie (Proprietaire ou ADMIN/STAFF) | Modification du nom ou du contenu d'un document. |
| `delete.yml` | DELETE | `/media/:id` | Authentifie (Proprietaire ou ADMIN/STAFF) | Suppression d'une piece jointe. |

## Execution via la CLI Bruno

Toute la suite de tests peut etre executee de maniere automatisee en ligne de commande depuis la racine du projet :

```bash
# Executer toute la collection sur l'environnement dev
bru run bruno --env dev

# Executer un dossier specifique (ex: le dossier user)
bru run bruno/user --env dev
```

## Codes HTTP et Gestion des Erreurs

- `200 OK` : Requete traitee avec succes.
- `204 No Content` : Suppression traitee avec succes.
- `400 Bad Request` : Parametre d'identifiant invalide ou donnees manquantes dans le corps de la requete.
- `401 Unauthorized` : Cookie de session absent, invalide ou expire.
- `403 Forbidden` : Privileges insuffisants pour effectuer l'action, ou tentative d'un etudiant d'acceder ou modifier les donnees d'un autre utilisateur.
- `404 Not Found` : Ressource cible inexistante en base de donnees.
- `429 Too Many Requests` : Seuil de frequence depasse sur un endpoint protege par le limiteur de debit (attendre le temps indique dans l'en-tete Retry-After).
- `500 Internal Server Error` : Erreur interne non interceptee ou defaillance de la base de donnees.
