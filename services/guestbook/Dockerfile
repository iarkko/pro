FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY services/guestbook ./services/guestbook

RUN node node_modules/prisma/build/index.js generate

ENV NODE_ENV=production
ENV PORT=4001

EXPOSE 4001

CMD ["node", "services/guestbook/server.mjs"]
