# =========================
# deps
# =========================
FROM node:20-slim AS deps

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm ci


# =========================
# builder
# =========================
FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"

RUN rm -rf .next

RUN node node_modules/prisma/build/index.js generate

RUN npm run build


# =========================
# runner
# =========================
FROM node:20-slim AS runner

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl netcat-openbsd

ENV NODE_ENV=production
ENV PORT=3000

RUN mkdir -p /app/uploads

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

EXPOSE 3000

# ✅ ВАЖНО: всё в одну строку
CMD sh -c "echo '⏳ Waiting for postgres...' && until nc -z postgres 5432; do sleep 1; done && echo '🚀 Running prisma db push...' && node node_modules/prisma/build/index.js db push && echo '✅ Starting Next.js...' && node node_modules/next/dist/bin/next start -H 0.0.0.0 -p 3000"