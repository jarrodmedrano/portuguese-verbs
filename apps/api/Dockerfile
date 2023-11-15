FROM node:18-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get autoclean
RUN apt-get clean
FROM base AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apt-get update
RUN apt-get install -y openssl
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .

# RUN turbo prune database --docker
RUN turbo prune --scope=api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update
RUN apt-get install -y openssl
WORKDIR /app
RUN yarn global add pnpm
# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY packages/database /app/packages/database
COPY apps/api /app/apps/api
COPY apps/api/tsconfig.json /app/apps/api/tsconfig.json

## console log the contents of this directory
RUN pnpm install

# Build the project and its dependencies

# RUN mkdir -p packages/database
# RUN mkdir -p apps/api
# COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN
RUN pnpm turbo run build --filter=api...

FROM base AS runner
WORKDIR /app
RUN apt-get update
RUN apt-get update -qq && \
    apt-get install -y openssl
# # Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

EXPOSE 8080
ENV PORT 8080
COPY --from=installer /app .

CMD node apps/api/dist/index.js