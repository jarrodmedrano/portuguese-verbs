# TURBOREPO + tRPC

.

## Technologies

- [TURBOREPO](https://turborepo.org)
- [tRPC](https://trpc.io)
- [ExpressJS](https://expressjs.com/)
- [NextJS](https://nextjs.org/)

## Startup dev

`sh docker.dev.sh`

Open http://localhost:3000.

# Start prod in detached mode

`sh docker.prod.sh`

Open http://localhost:3000.

# Build AWS Infrastructure

Building the base in AWS

`cd terraform/base`

Add the required variables in terraform.tfvars

`terraform apply`

Building the app in AWS

`cd terraform/app`

Add the required variables in terraform.tfvars

`terraform apply`

# Build ECR repositories

Repositories will be created for api, client and verbecc and pushed up to AWS on each commit. You will need to add your
secret variables in Github.

#### Author: Jarrod Medrano 👨🏻‍💻
