aws cloudformation create-stack \
 --stack-name compose-infrastructure \
 --template-body file://cloudformation.yml \
 --capabilities CAPABILITY_IAM

VPC_ID=$(aws cloudformation describe-stacks --stack-name compose-infrastructure --query "Stacks[0].Outputs[?OutputKey=='VpcId'].OutputValue" --output text)

# Set the ECS Cluster Name

ECS_CLUSTER=$(aws cloudformation describe-stacks --stack-name compose-infrastructure --query "Stacks[0].Outputs[?OutputKey=='ClusterName'].OutputValue" --output text)

# The Loadbalancer Arn

LOADBALANCER_ARN=$(aws cloudformation describe-stacks --stack-name compose-infrastructure --query "Stacks[0].Outputs[?OutputKey=='LoadbalancerId'].OutputValue" --output text)