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

RUN npx prisma generate
RUN npm run build


# =========================
# runner
# =========================
FROM node:20-slim AS runner

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

ENV NODE_ENV=production

# uploads внутри контейнера (volume перекроет при необходимости)
RUN mkdir -p /app/uploads

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public

EXPOSE 3000

# 🔥 ВАЖНО: слушаем 0.0.0.0, иначе будет Empty reply / 502
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]