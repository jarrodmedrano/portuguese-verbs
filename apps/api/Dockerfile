FROM node:18-slim AS builder
RUN apt-get autoclean
RUN apt-get clean
RUN apt-get update
RUN apt-get install -y openssl
# Set working directory
WORKDIR /app

RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:18-slim AS installer
RUN apt-get update
RUN apt-get install -y openssl
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN apt-get update && apt-get install -y openssl
RUN yarn install --frozen-lockfile
RUN yarn prisma

# Build the project
COPY --from=builder /app/out/full/ .
RUN apt-get update && apt-get install -y openssl
RUN yarn run prebuild
RUN yarn turbo run build --filter=api...

FROM node:18-slim AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
RUN apt-get update && apt-get install -y openssl
USER expressjs

EXPOSE 4000
ENV PORT 4000
COPY --from=installer /app .
CMD node apps/api/dist/index.js
