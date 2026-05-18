# syntax=docker/dockerfile:1.7

FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc /app/
RUN npm ci

FROM node:20-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules /app/node_modules
COPY . /app
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public /app/public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone /app/
COPY --from=builder --chown=nextjs:nodejs /app/.next/static /app/.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
