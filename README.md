# Portfolio Site

Next.js portfolio site with subprojects. The main page is the top-level site;
Recipe Book is one live subproject with cover images, preparation steps, step
photos, editing and deletion.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database

The app uses PostgreSQL through Prisma. Set `DATABASE_URL` before running the
app, then prepare the database:

```bash
npx prisma migrate deploy
```

## Auth

The site stores users and sessions in PostgreSQL. Permissions are split into
`read`, `create`, and `delete`; the `owner` role receives all three.

Create or update the owner account:

```bash
npm run user:create -- you@example.com "strong-password" owner "Your Name"
```

Inside Docker Compose:

```bash
docker compose exec app npm run user:create -- you@example.com "strong-password" owner "Your Name"
```

Other available roles are `reader`, `creator`, and `deleter`.

When testing the production container over plain HTTP, set
`AUTH_COOKIE_SECURE=false`. Keep secure cookies enabled behind HTTPS.

Owners can manage client accounts at `/admin/users`. The admin UI is locked to
the `owner` role and supports creating clients, changing `read` / `create` /
`delete` permissions, resetting passwords, and deleting clients.

## Docker

```bash
docker compose up --build
```

Uploaded images are stored in the ignored `uploads/` directory and served from
`/uploads/:file`.

## Guestbook Microservice

The public guestbook is implemented as a separate Node.js HTTP service in
`services/guestbook`. Next.js proxies browser traffic through `/api/guestbook`.

Local service run:

```bash
npm run guestbook:dev
```

Useful endpoints:

```text
GET /healthz
GET /readyz
GET /messages
POST /messages
GET /metrics
```

## Checks

```bash
npm run lint
npm run build
```
