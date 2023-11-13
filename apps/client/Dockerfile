FROM node:18-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get autoclean
RUN apt-get clean
RUN apt-get update

# Set working directory
WORKDIR /app
COPY . .
# Only Take packages that are needed to compile this app
RUN npx turbo prune --scope=client --docker

# Add lockfile and package.json's of isolated subworkspace
FROM --platform=linux/amd64 node:18-slim AS installer
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/turbo.json ./turbo.json
RUN corepack enable && corepack prepare pnpm@7.4.1 --activate 
RUN pnpm install --no-frozen-lockfile

FROM --platform=linux/amd64 node:18-slim AS sourcer
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get autoclean
RUN apt-get clean
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
# RUN apt-get update -y && apt-get install -y openssl
# RUN apt-get install -y openssl
RUN corepack enable && corepack prepare pnpm@7.4.1 --activate
COPY .gitignore .gitignore
RUN npx turbo run build  --filter=client...

FROM --platform=linux/amd64 node:18-slim as runner
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@7.4.1 --activate
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=sourcer /app/apps/client/next.config.js .
COPY --from=sourcer /app/apps/client/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=sourcer --chown=nextjs:nodejs /app/apps/client/.next/standalone ./
COPY --from=sourcer --chown=nextjs:nodejs /app/apps/client/.next/static ./apps/client/.next/static
# COPY --from=sourcer --chown=nextjs:nodejs /app/apps/client/public ./apps/client/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/start.sh ./
# COPY /app/apps/client/server.js ./
# COPY --from=builder /app/apps/client/.env.local ./

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"
# CMD ["/bin/sh", "/app/start.sh"]
CMD node apps/client/server.js