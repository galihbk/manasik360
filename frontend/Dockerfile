# ==========================================
# FRONTEND PRODUCTION DOCKERFILE
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Runner stage
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["npm", "run", "start"]
