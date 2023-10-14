FROM node:18-slim AS builder
ENV PNPM_HOME=/usr/local/bin
RUN corepack enable
RUN apt-get autoclean
RUN apt-get clean
RUN apt-get update
# Set working directory
WORKDIR /app

COPY . .
RUN pnpm global add turbo
RUN turbo prune --scope=api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:18-slim AS installer
RUN apt-get update
# RUN apt-get install -y openssl
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm.lock ./pnpm.lock
# RUN apt-get update && apt-get install -y openssl
RUN corepack enable
RUN pnpm install --frozen-lockfile
RUN pnpm prisma

# Build the project
COPY --from=builder /app/out/full/ .
# RUN apt-get update && apt-get install -y openssl
RUN corepack enable
RUN pnpm run prebuild
RUN turbo run build --filter=api...

FROM node:18-slim AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
# RUN apt-get update && apt-get install -y openssl
USER expressjs

EXPOSE 8080
ENV PORT 8080
COPY --from=installer /app .
CMD node apps/api/dist/index.js
