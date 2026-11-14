FROM node:24-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
COPY . .
RUN npm run build

FROM build AS local
ENV NODE_ENV=production \
    PORT=8081 \
    PRISMA_DISABLE_TELEMETRY=1
RUN mkdir /app/.schema-work && chown node:node /app/.schema-work
USER node
EXPOSE 8081
CMD ["sh", "-c", "node scripts/prepare-docker-db.mjs && exec node dist/main.js"]

FROM node:24-bookworm-slim AS production-dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8081
COPY --from=build /app/package.json ./
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
EXPOSE 8081
CMD ["node", "dist/main.js"]
