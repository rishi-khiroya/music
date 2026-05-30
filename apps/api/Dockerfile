FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
RUN pnpm install --frozen-lockfile --filter api...

FROM deps AS build
COPY . .
RUN pnpm --filter api build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
ENV API_PORT=3100

WORKDIR /app/apps/api

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/apps/api/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json

EXPOSE 3100

CMD ["node", "dist/index.js"]