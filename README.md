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

# Build prod using new BuildKit engine

`COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build`

# Start prod in detached mode

`docker-compose -f docker-compose.yml up -d`

Open http://localhost:3000.

To shutdown all running containers:

# Stop all running containers

`docker kill $(docker ps -q) && docker rm $(docker ps -a -q)`

This sample CloudFormation template will create a VPC, Public and Private Subnets, and an Amazon ECS cluster following
AWS best practices. The sample template will also create an Application Load Balancer that will front the sample
application. There is an assumption at this stage, that the awscli is already installed on your workstation, with the
relevant IAM credentials to create the networking infrastructure in an AWS account.

# Navigate to the Infrastructure Directory

`cd ../cloudformation/infrastructure`

# Deploy the CloudFormation Template

```aws cloudformation create-stack \
 --stack-name compose-infrastructure \
 --template-body file://cloudformation.yml \
 --capabilities CAPABILITY_IAM
```

The VPC ID, ECS cluster, and Application Load Balancer ARN will be needed later in the pipeline. If you are leveraging
the sample CloudFormation template, these can be set as local variables by running the following commands when the
CloudFormation stack has been successfully deployed:

# Set the VPC Id

`VPC_ID=$(aws cloudformation describe-stacks --stack-name compose-infrastructure --query "Stacks[0].Outputs[?OutputKey=='VpcId'].OutputValue" --output text)`

# Set the ECS Cluster Name

`ECS_CLUSTER=$(aws cloudformation describe-stacks --stack-name compose-infrastructure --query "Stacks[0].Outputs[?OutputKey=='ClusterName'].OutputValue" --output text)`

# The Loadbalancer Arn

`LOADBALANCER_ARN=$(aws cloudformation describe-stacks --stack-name compose-infrastructure --query "Stacks[0].Outputs[?OutputKey=='LoadbalancerId'].OutputValue" --output text)`

# Pipeline infrastructure

This walk through leverages AWS CodePipeline, AWS CodeBuild, and AWS CloudFormation to deploy the sample application to
Amazon ECS. To deploy the components of the pipeline, a CloudFormation template is supplied within the sample app
repository. This CloudFormation template deploys the following resources:

An S3 bucket to store the source code of the application Amazon ECR repository for the sample application’s container
image

- An AWS CodePipeline to orchestrate the pipeline
- An AWS CodeBuild job to build the container images
- An AWS CodeBuild job to convert the Docker Compose file to the CloudFormation template

# Navigate to the directory that stores the Pipeline Template

`cd ../cloudformation/pipeline/`

# Deploy the AWS CloudFormation Template, passing in the existing AWS Resource Paramaters

```
aws cloudformation create-stack \
 --stack-name compose-pipeline \
 --template-body file://cloudformation.yml \
 --capabilities CAPABILITY_IAM \
 --parameters \
 ParameterKey=ExistingAwsVpc,ParameterValue=$VPC_ID \
     ParameterKey=ExistingEcsCluster,ParameterValue=$ECS_CLUSTER \
 ParameterKey=ExistingLoadbalancer,ParameterValue=$LOADBALANCER_ARN
```

# Deploy the sample application to AWS

In the git repository, we store the application code alongside the infrastructure as code. To deploy the sample
application to AWS, only the application source code and the docker-compose.yml need to be uploaded to Amazon S3. These
artifacts are all included in the application directory within the repository.

# Ensure you are in the Application directory of the cloned repository

`cd ../../application`

# Retrieve the S3 Bucket Name

```
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name compose-pipeline --query "Stacks[0].Outputs[?OutputKey=='S3BucketName'].OutputValue" --output text)
```

# Zip up the Code and Upload to S3

```
git archive --format=zip HEAD -o compose-bundle.zip
aws s3 cp compose-bundle.zip s3://$BUCKET_NAME/compose-bundle.zip
```

Copying the ZIP file into the S3 bucket will trigger the CodePipeline; after a few seconds the pipeline will transition
to the first stage, building the container image via CodeBuild. When the Docker Compose file is ran locally with docker
compose up, Docker Compose is building the container image and starting the container. However when deploying via the
pipeline we will break the build out into its own stage. It is common for Unit Tests and Container Scanning Tools to run
at this stage of the pipeline before the image is tagged and pushed to Amazon ECR.

The commands to build the container image are defined in a BuildSpec file. The following BuildSpec file was embedded
within the pipeline CloudFormation template. The CodeBuild Job first downloads and unzips the compose-bundle.zip before
running any steps. CodeBuild will then work its way through the BuildSpec file, first authenticating with Amazon ECR,
navigating to the source code directory, building the container image via docker build, and finally pushing the
container image to Amazon ECR.

```
version: 0.2
phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
  build:
    commands:
      - echo Building the Docker image...
      - cd frontend/
      - docker build -t $IMAGE_URI:$IMAGE_TAG .
  post_build:
    commands:
       - echo Pushing the Docker image...
      - docker push $IMAGE_URI:$IMAGE_TAG
```

Following the image build, the Docker Compose file will then be converted into CloudFormation. The following CodeBuild
BuildSpec file is also embedded within the Pipeline CloudFormation Template for the “Convert2Cloudformation” stage.

This BuildSpec file will do the following:

- Install the Docker Compose CLI
- Create a Docker Compose Context by extracting the IAM role attached to the CodeBuild job
- Convert the Docker Compose File to Cloudformation with docker compose convert.

```
version: 0.2
phases:
 install:
   commands:
     - mv /usr/local/bin/docker /usr/bin/docker
     - curl -L https://raw.githubusercontent.com/docker/compose-cli/main/scripts/install/install_linux.sh | sh
 pre_build:
   commands:
     - echo Logging in to Amazon ECR...
     - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
     - echo Creating Docker Compose Context
     - curl "http://169.254.170.2${AWS_CONTAINER_CREDENTIALS_RELATIVE_URI}" > creds.json
     - export AWS_ACCESS_KEY_ID=$(cat creds.json | jq -r .AccessKeyId)
     - export AWS_SECRET_ACCESS_KEY=$(cat creds.json | jq -r .SecretAccessKey)
     - export AWS_SESSION_TOKEN=$(cat creds.json | jq -r .Token)
     - docker context create ecs demoecs --from-env
     - docker context use demoecs
 build:
   commands:
     - echo Convert Compose File
     - docker --debug compose convert > cloudformation.yml
artifacts:
  files:
    - cloudformation.yml
```

## Cleanup

# Delete the Sample Application deployed via the Pipeline

`aws cloudformation delete-stack --stack-name compose-application`

# Delete the S3 Objects

```
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name compose-pipeline --query "Stacks[0].Outputs[?OutputKey=='S3BucketName'].OutputValue" --output text)
aws s3api delete-objects \
  --bucket $BUCKET_NAME --delete \
  "$(aws s3api list-object-versions \
    --bucket "${BUCKET_NAME}" \
    --output=json \
    --query='{Objects: Versions[].{Key:Key,VersionId:VersionId}}')"
```

# Delete the S3 Bucket

`aws s3 rb s3://$BUCKET_NAME`

# Delete the ECR Repository

```
ECR_REPO=$(aws cloudformation describe-stacks --stack-name compose-pipeline --query "Stacks[0].Outputs[?OutputKey=='DemoAppEcrName'].OutputValue" --output text)
aws ecr delete-repository --repository-name $ECR_REPO --force
```

# Delete the Sample Pipeline

`aws cloudformation delete-stack --stack-name compose-pipeline`

# Delete the Networking and ECS Infrastructure

`aws cloudformation delete-stack --stack-name compose-infrastructure`

#### Author: Jarrod Medrano 👨🏻‍💻
