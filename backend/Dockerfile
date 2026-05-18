# ==========================================
# BACKEND PRODUCTION DOCKERFILE
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

# Install native dependencies required for openssl / prisma client binary
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

COPY . .

# Runner stage
FROM node:18-alpine AS runner

WORKDIR /app

# Re-install openssl for production runtime
RUN apk add --no-cache openssl

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/seed.js ./seed.js

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

CMD ["node", "src/server.js"]
