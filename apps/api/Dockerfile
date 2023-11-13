FROM --platform=linux/arm64 node:18-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get autoclean
RUN apt-get clean
RUN apt-get update
RUN apt-get install -y openssl
# Set working directory
WORKDIR /app

COPY . .
RUN npx turbo prune --scope=api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM --platform=linux/arm64 node:18-slim AS installer
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update
RUN apt-get install -y openssl
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY package.json ./package.json
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# RUN apt-get update -y && apt-get install -y openssl
RUN corepack enable && corepack prepare pnpm@7.4.1 --activate 
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile

# Build the project
# COPY --from=builder /app/out/full/ .
# RUN apt-get update -y && apt-get install -y openssl
RUN npx turbo run build --filter=api...

FROM --platform=linux/arm64 node:18-slim AS runner
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
# RUN apt-get update && apt-get install -y openssl
COPY --from=installer /app/apps/api/package.json .
RUN corepack enable && corepack prepare pnpm@7.4.1 --activate 
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile
COPY --from=installer /app/apps/api/dist .
USER expressjs

EXPOSE 8080
ENV PORT 8080
COPY --from=installer /app/apps/api/ .
CMD node apps/api/dist/index.js
