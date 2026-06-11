# Lost & Found – Frontend (Modul 294)

Angular-Frontend zur **Lost & Found**-Plattform. Es greift auf das Spring-Boot-Backend
(Modul 295) zu und bietet eine vollständige Oberfläche (CRUD) für **Gegenstände (Items)**,
**Meldungen (Reports)**, **Ansprüche (Claims)** und **Benutzer (Users)**.

Die Anmeldung erfolgt über **Keycloak** (OAuth2 / OpenID Connect). Je nach Rolle
(`user` oder `admin`) stehen unterschiedliche Funktionen zur Verfügung.

---

## 1. Architektur / Zusammenspiel

| Komponente | Technologie | Port |
|------------|-------------|------|
| Frontend (dieses Projekt) | Angular 21 + Angular Material | `4200` |
| Backend (Modul 295) | Spring Boot REST API | `9090` |
| Keycloak (Login) | Keycloak Realm `lostandfound` | `8080` |
| Datenbank | PostgreSQL (DB `lostandfound`) | `5432` |

Ablauf: Das Frontend (`:4200`) leitet zum Login auf Keycloak (`:8080`) weiter,
erhält ein JWT und ruft damit die geschützte REST-API des Backends (`:9090`) auf.

---

## 2. Voraussetzungen

Folgende Programme müssen installiert sein:

- **Node.js** ≥ 20 LTS inkl. npm → <https://nodejs.org>
- **Angular CLI 21**: `npm install -g @angular/cli`
- **JDK 26** (für das Backend)
- **PostgreSQL** (Datenbank)
- **Keycloak** (24+) – als Download oder via Docker
- Optional: **Docker Desktop** (einfachster Weg für PostgreSQL + Keycloak)

---

## 3. Backend starten (Modul 295)

> Das Backend liegt im Projekt `lostandfound-backend`.

1. **PostgreSQL** starten und eine leere Datenbank anlegen:
   ```sql
   CREATE DATABASE lostandfound;
   ```
   Die Tabellen werden beim ersten Start automatisch durch Hibernate erstellt
   (`ddl-auto: update`).

2. Datenbank-Zugangsdaten prüfen in `lostandfound-backend/src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/lostandfound
       username: postgres
       password: 12345        # <-- bei Bedarf anpassen, siehe Abschnitt 7
   ```

3. Backend starten:
   ```bash
   cd lostandfound-backend
   ./mvnw spring-boot:run          # Windows: .\mvnw.cmd spring-boot:run
   ```
   Läuft anschliessend auf <http://localhost:9090>.
   Swagger-UI: <http://localhost:9090/swagger-ui.html>

---

## 4. Keycloak einrichten

1. **Keycloak starten** (Beispiel mit Docker):
   ```bash
   docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:24.0 start-dev
   ```
   Admin-Konsole: <http://localhost:8080> (Login `admin` / `admin`).

2. **Realm importieren**: In der Admin-Konsole oben links auf das Realm-Dropdown →
   *Create Realm* → Datei `lostandfound-backend/keycloak/lostandfound-realm.json`
   hochladen → *Create*.

   Damit werden automatisch angelegt:
   - Realm **`lostandfound`**
   - Client **`lostandfound`** (public, Redirect-URIs für `:4200` und `:9090`)
   - Rollen **`user`** und **`admin`**
   - Zwei Testbenutzer (siehe unten)

### Testbenutzer

| Benutzername | Passwort | Rollen | Darf … |
|--------------|----------|--------|--------|
| `user`  | `user`  | user        | lesen + neue Einträge anlegen |
| `admin` | `admin` | user, admin | zusätzlich bearbeiten + löschen |

> ⚠️ Diese Passwörter unbedingt vor der Abgabe / dem produktiven Einsatz ändern
> (siehe Abschnitt 7).

---

## 5. Frontend starten (dieses Projekt)

```bash
cd 294-frontend
npm install            # einmalig – installiert alle Abhängigkeiten
npm start              # startet den Dev-Server auf http://localhost:4200
```

Browser öffnen: <http://localhost:4200>

- Auf dem Dashboard auf **Login** klicken → Weiterleitung zu Keycloak → mit
  `admin` / `admin` (oder `user` / `user`) anmelden.
- Über die obere Navigationsleiste zu **Gegenstände / Meldungen / Ansprüche / Benutzer** navigieren.
- Die Oberfläche ist durchgehend auf Deutsch.

Produktiv-Build erstellen:
```bash
npm run build          # Ergebnis landet in dist/lostandfound-frontend
```

---

## 6. Rollen & Funktionen

| Aktion | `user` | `admin` |
|--------|:------:|:-------:|
| Listen ansehen | ✅ | ✅ |
| Neuen Eintrag anlegen | ✅ | ✅ |
| Eintrag bearbeiten | ❌ | ✅ |
| Eintrag löschen | ❌ | ✅ |

Die Bearbeiten-/Löschen-Buttons werden nur für `admin` angezeigt. Das Backend
erzwingt dieselben Regeln zusätzlich serverseitig (`@RolesAllowed`).

---

## 7. Passwörter ändern (vor der Abgabe!)

Standardmässig sind überall einfache Demo-Passwörter gesetzt. So werden sie geändert:

### a) Datenbank-Passwort (PostgreSQL)
1. In PostgreSQL das Passwort des Benutzers ändern, z. B.:
   ```sql
   ALTER USER postgres WITH PASSWORD 'DEIN_NEUES_PASSWORT';
   ```
2. Dasselbe Passwort eintragen in
   `lostandfound-backend/src/main/resources/application.yml` →
   `spring.datasource.password`.

### b) Keycloak-Admin-Passwort
- Beim Docker-Start die Variable `KEYCLOAK_ADMIN_PASSWORD` setzen, **oder**
- in der Admin-Konsole: oben rechts auf den Benutzernamen → *Manage account* →
  *Signing in* → Passwort ändern.

### c) Passwörter der Testbenutzer (`user` / `admin`)
1. Admin-Konsole → Realm **lostandfound** → *Users* → Benutzer wählen.
2. Reiter *Credentials* → *Reset password* → neues Passwort setzen,
   *Temporary* auf **Off** stellen → *Save*.

> Hinweis: Die Frontend-Konfiguration (`src/app/app.config.ts`) und das Backend
> enthalten **keine** Passwörter – nur den Keycloak-`issuer` und die `clientId`.
> Es müssen also nur die oben genannten drei Stellen angepasst werden.

---

## 8. Wichtige Konfigurationswerte

Falls Ports/URLs abweichen, hier anpassen:

| Wert | Datei |
|------|-------|
| Backend-URL (`http://localhost:9090/api/`) | `src/environments/environment.ts` (+ `.prod.ts`) |
| Keycloak-Issuer / Client-ID | `src/app/app.config.ts` (`authConfig`) |
| Dev-Proxy auf `/api` | `proxy.conf.json` |

---

## 9. Fehlerbehebung (Troubleshooting)

- **Login schlägt fehl / Endlos-Weiterleitung:** Keycloak läuft nicht auf `:8080`
  oder der Realm `lostandfound` wurde nicht importiert.
- **CORS-Fehler im Browser:** Backend nicht gestartet, oder Frontend läuft nicht
  exakt auf `http://localhost:4200` (das Backend erlaubt nur diesen Origin).
- **401/403 beim Speichern:** Mit `user` angemeldet, aber Bearbeiten/Löschen
  versucht – dafür wird die Rolle `admin` benötigt.
- **Leere Listen:** Backend läuft, aber Datenbank ist noch leer – zuerst über die
  Oberfläche Einträge anlegen (zuerst Benutzer & Gegenstände, dann Meldungen, dann Ansprüche).
- **`npm start` Port belegt:** anderen Port nutzen mit `ng serve --port 4300`
  (Keycloak-Redirect-URI dann entsprechend anpassen).

---

## 10. Projektstruktur (Kurzüberblick)

```
src/app/
  dataaccess/   Datenmodelle (user, item, report, claim)
  service/      REST-Services + Auth/Header/Paginator
  guard/        Route-Guard (Rollenprüfung)
  interceptor/  CSRF-Interceptor
  dir/          Direktiven (Autofokus, Rollen-Sichtbarkeit)
  components/   Header, Login, Bestätigungs-Dialog, Basis-Komponente
  pages/        Listen- und Detail-Seiten je Entität + Dashboard / No-Access
  app.config.ts OAuth2/Keycloak-Konfiguration & Provider
  app.routes.ts Routing inkl. Rollen
assets/i18n/    Texte (de_CH.json, Deutsch)
```
