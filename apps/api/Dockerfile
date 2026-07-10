# ==========================================
# BACKEND API DOCKERFILE (Monorepo context)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/
COPY packages/database/package.json ./packages/database/
COPY packages/localization/package.json ./packages/localization/
COPY packages/ui/package.json ./packages/ui/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile --ignore-scripts || pnpm install --no-frozen-lockfile

COPY packages ./packages
COPY apps/api ./apps/api
RUN cp apps/api/seed.js ./seed.js

RUN pnpm --filter @bahrain/types build
RUN pnpm --filter @bahrain/database build
RUN pnpm --filter api build

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm@9

COPY --from=builder /app ./

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

CMD ["pnpm", "--filter", "api", "dev"]
