FROM node:16-alpine as builder
WORKDIR '/app'
COPY package.json .
RUN pnpm install
COPY . .
RUN pnpm build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html