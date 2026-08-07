# PRP Backend  Parish Records Portal API

Secure REST API for the Parish Records Portal (PRP). Node.js + Express +
SQLite (file-based, zero external DB server required to get started).

## 1. Install

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in real values  especially `JWT_ACCESS_SECRET`,
`JWT_REFRESH_SECRET`, your SMTP credentials, and `SUPERADMIN_*`.

Generate strong secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 2. Create your Super Admin account (you)

```bash
npm run seed:superadmin
```

This reads `SUPERADMIN_NAME` / `SUPERADMIN_EMAIL` / `SUPERADMIN_PASSWORD`
from `.env` (or prompts you interactively if left blank). There is **no API
route** that creates a super_admin  it can only be done from this script on
the server itself, so nobody in the app, including other admins, can grant
themselves your level of access.

## 3. Run

```bash
npm run dev      # auto-restart on file changes
# or
npm start        # production
```

The API listens on `http://localhost:4000` by default. Check it's alive:
```bash
curl http://localhost:4000/api/health
```

## 4. Point the frontend at it

In `frontend/.env`:
```
VITE_API_URL=http://localhost:4000/api
```
And in `frontend/src/services/api.js`, `MOCK_MODE` is now `false` (already
done in the delivered frontend) — the app will talk to this backend.

## Project layout

```
src/
  config/        env loader, SQLite connection + schema
  middleware/     auth (JWT), RBAC, rate limiting, uploads, error handling
  models/         userModel (password hashing, CRUD)
  controllers/    business logic per resource
  routes/         Express routers, one per resource
  scripts/        createSuperAdmin.js, seedDemoData.js
uploads/          uploaded/captured files (gitignored)
data/             prp.db SQLite file (gitignored)
```

## Roles

| Role         | Who                        | Can do |
|--------------|----------------------------|--------|
| `super_admin`| You (system owner)         | Everything, every parish, incl. creating/removing admins |
| `admin`      | Katibu / Padre per parish  | Manage secretary/viewer users **within their own parish**, records, documents |
| `secretary`  | Parish office staff        | Create/edit records, upload documents |
| `viewer`     | Read-only staff            | View only |

Full explanation of how to operate this as the Super Admin is in
**`docs/Admin_and_Security_Guide.docx`** in the project root.

## Security features implemented

- Passwords hashed with bcrypt (cost factor 12), never stored/returned in plaintext
- JWT short-lived access tokens (15 min) + rotating httpOnly refresh cookie
- Account lockout after repeated failed logins
- Rate limiting on login and forgot-password endpoints
- Password reset tokens: single-use, hashed at rest, time-limited, emailed only
  to the address already on file for that account
- Generic responses on forgot-password so the API never reveals which emails
  are registered
- Role-based access control enforced server-side on every route
- Append-only audit log of logins, user management actions, and document access
- Helmet security headers + strict CORS allow-list
- File upload validation (type + size limits) for camera/document capture
- SQL injection protected by parameterized queries throughout

See `docs/Admin_and_Security_Guide.docx` for deployment hardening
(HTTPS/TLS, backups, hosting options, 2FA recommendation, etc).
