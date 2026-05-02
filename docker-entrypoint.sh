#!/bin/sh

set -e

echo "🚀 running migrations..."
npx prisma migrate deploy

echo "🚀 starting app..."
npm run start