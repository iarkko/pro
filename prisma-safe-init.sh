#!/bin/sh

echo "⏳ Waiting for Postgres..."

until nc -z postgres 5432; do
  sleep 1
done

echo "✅ Postgres is ready"

echo "🔧 Prisma generate"
npx prisma generate

echo "📦 Prisma migrate deploy"
npx prisma migrate deploy

echo "🚀 Starting app"
node server.js