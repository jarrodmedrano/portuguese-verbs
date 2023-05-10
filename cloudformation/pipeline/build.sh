aws cloudformation create-stack \
 --stack-name compose-pipeline \
 --template-body file://cloudformation.yml \
 --capabilities CAPABILITY_IAM \
 --parameters \
 ParameterKey=ExistingAwsVpc,ParameterValue=$VPC_ID \
     ParameterKey=ExistingEcsCluster,ParameterValue=$ECS_CLUSTER \
 ParameterKey=ExistingLoadbalancer,ParameterValue=$LOADBALANCER_ARN