# Nuxt modules (nuxt-og-image) need real Node APIs at build time; Bun is only used to install and to run the output
FROM node:24-alpine AS builder

COPY --from=oven/bun:1-alpine /usr/local/bin/bun /usr/local/bin/bun

WORKDIR /app

COPY package.json bun.lock ./

# Skip postinstall (`nuxt prepare`): sources are not copied yet, `nuxt build` prepares on its own
RUN bun install --frozen-lockfile --ignore-scripts

COPY . .

ENV NITRO_PRESET=bun

RUN bun run build

FROM oven/bun:1-alpine AS runner

ARG VERSION
ARG BUILD_TIME

WORKDIR /app

COPY --from=builder --chown=bun:bun /app/.output ./.output

ENV NODE_ENV=production
ENV NUXT_META_VERSION=$VERSION
ENV NUXT_META_BUILD_TIME=$BUILD_TIME

USER bun

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD bun -e "fetch('http://localhost:3000/api/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

ENTRYPOINT ["bun", ".output/server/index.mjs"]
