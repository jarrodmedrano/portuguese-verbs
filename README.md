# TURBOREPO + tRPC

.

## Technologies

- [TURBOREPO](https://turborepo.org)
- [tRPC](https://trpc.io)
- [ExpressJS](https://expressjs.com/)
- [NextJS](https://nextjs.org/)

## Startup

# Create a network, which allows containers to communicate

# with each other, by using their container name as a hostname

docker network create app_network

# Build prod using new BuildKit engine

COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build

# Start prod in detached mode

docker-compose -f docker-compose.yml up -d

Open http://localhost:3000.

To shutdown all running containers:

# Stop all running containers

docker kill $(docker ps -q) && docker rm $(docker ps -a -q)

#### Author: Jarrod Medrano 👨🏻‍💻
