# syntax=docker/dockerfile:1

FROM node:22.13.1-bookworm-slim AS base

WORKDIR /usr/src/app

FROM base AS build-dependencies

RUN apt-get update \
  && apt-get install --yes --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

FROM build-dependencies AS build

COPY . ./

# Vite generates the production stylesheet only inside this image layer.
RUN npm run build \
  && find src -type f -name '*.json' -exec sh -c '\
    for source in "$@"; do \
      target="dist/${source#src/}"; \
      mkdir -p "$(dirname "$target")"; \
      cp "$source" "$target"; \
    done' sh {} +

FROM base AS production-dependencies

RUN apt-get update \
  && apt-get install --yes --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
  && npm cache clean --force

FROM node:22.13.1-bookworm-slim AS production

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /usr/src/app

RUN groupadd --system --gid 10001 workless \
  && useradd --system --uid 10001 --gid workless --create-home workless

COPY --from=production-dependencies --chown=workless:workless /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=workless:workless /usr/src/app/dist ./dist
COPY --from=build --chown=workless:workless /usr/src/app/public ./public
USER workless

EXPOSE 3000

CMD ["node", "dist/main.js"]
