# Recipe Book

Next.js application for saving recipes with cover images, preparation steps,
step photos, editing and deletion.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/recipes`.

## Database

The app uses PostgreSQL through Prisma. Set `DATABASE_URL` before running the
app, then prepare the database:

```bash
npx prisma db push
```

## Docker

```bash
docker compose up --build
```

Uploaded images are stored in the ignored `uploads/` directory and served from
`/uploads/:file`.

## Checks

```bash
npm run lint
npm run build
```
