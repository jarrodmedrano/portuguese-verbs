#!/bin/sh
FROM --platform=linux/amd64 node:18-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update -qq && apt-get install -y openssl

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM --platform=linux/amd64 base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
#RUN pnpm global add turbo
RUN turbo prune --scope=client --docker

# Add lockfile and package.json's of  isolated subworkspace
FROM --platform=linux/amd64 base AS installer
RUN apt-get update
RUN apt-get update -qq && \
    apt-get install -y openssl
WORKDIR /app
RUN yarn global add pnpm
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY packages/database /app/packages/database
COPY apps/api /app/apps/api
COPY apps/client /app/apps/client
RUN pnpm install

# Build the project
# COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo run build --filter=client...
# CMD ["tail", "-f", "/dev/null"]

FROM --platform=linux/amd64 base as runner
WORKDIR /app
COPY --from=builder /app/apps/client/entrypoint.sh .
RUN chmod +x ./entrypoint.sh
COPY --from=builder /app/apps/client/start.sh .
RUN chmod +x ./start.sh
COPY --from=builder /app/apps/client/.env.production ./apps/client/
# RUN chmod +x ./apps/client/entrypoint.sh
# RUN useradd -ms /bin/sh example
# RUN chmod -R 777 /tmp
# COPY --from=installer --chown=root:root /tmp /tmp
# RUN chmod +w ./apps/client/
# USER root
ENTRYPOINT ["sh", "./entrypoint.sh"]
# ENV NODE_ENV production
# Don't run production as root
RUN addgroup --system --gid 1012 nodejs
RUN adduser --system --uid 1013 nextjs
RUN apt-get install grep
RUN apt-get install sudo
# RUN chmod u+x ./apps/client/.env.production
# USER nextjs
# COPY --from=installer /app/apps/client/next.config.js .
# COPY --from=installer /app/apps/client/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/client/.next/static ./apps/client/.next/static
# COPY --from=installer --chown=nextjs:nodejs /app/apps/client/public ./apps/client/public
# COPY --from=builder --chown=nextjs:nodejs /app/apps/client/start.sh ./
RUN chown -R nextjs:nodejs ./apps/client
RUN chown -R nextjs:nodejs ./apps/client/.env.production
# COPY /app/apps/client/server.js ./
# COPY --from=builder /app/apps/client/.env.local ./
USER nextjs

EXPOSE 3000
ENV NODE_ENV production
ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"
# RUN ["/bin/sh", "entrypoint.sh"]
CMD ["sh", "./start.sh"]