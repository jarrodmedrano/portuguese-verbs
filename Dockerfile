FROM node:18-slim AS builder
RUN apt-get update
# Set working directory
WORKDIR /app

RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=client --docker
RUN turbo prune --scope=api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:18-slim AS installer
RUN apt-get update
WORKDIR /app

RUN pwd
 
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install
 
# Build the project
COPY --from=builder /app/out/full/ .
RUN apt-get install -y openssl
# RUN npx prisma db pull && prisma generate
RUN cd packages/api && yarn run prebuild
RUN yarn turbo run build
 
FROM node:18-slim AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
 
COPY --from=installer /app/packages/client/next.config.mjs .
COPY --from=installer /app/packages/client/package.json .
 
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/packages/client/.next/static ./apps/client/.next/static
 
CMD node apps/client/server.js
