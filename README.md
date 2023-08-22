# TURBOREPO + tRPC

.

## Technologies

- [TURBOREPO](https://turborepo.org)
- [tRPC](https://trpc.io)
- [ExpressJS](https://expressjs.com/)
- [NextJS](https://nextjs.org/)

## Startup

Create a network, which allows containers to communicate with each other, by using their container name as a hostname

`docker network create app_network`

`sh docker.dev.sh`

# Build prod using new BuildKit engine

`COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build`

# Start prod in detached mode

`docker-compose -f docker-compose.yml up -d`

Open http://localhost:3000.

To shutdown all running containers:

# Stop all running containers

`docker kill $(docker ps -q) && docker rm $(docker ps -a -q)`

# Build terraform

`cd terraform && terraform apply`

Make sure to configure your aws cli using

`aws configure`

Retrieve an authentication token and authenticate your Docker client to your registry. Use the AWS CLI:

`aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin ${ID}.dkr.ecr.${REGION}.amazonaws.com`

Note: If you receive an error using the AWS CLI, make sure that you have the latest version of the AWS CLI and Docker
installed. Build your Docker image using the following command. For information on building a Docker file from scratch
see the instructions here . You can skip this step if your image is already built:

`docker build -t portuguese-verbs .`

After the build completes, tag your image so you can push the image to this repository:

`docker tag portuguese-verbs:latest ${ID}.dkr.ecr.${REGION}.amazonaws.com/portuguese-verbs:latest`

Run the following command to push this image to your newly created AWS repository:

`docker push ${ID}.dkr.ecr.${REGION}.amazonaws.com/portuguese-verbs:latest`

#### Author: Jarrod Medrano 👨🏻‍💻
