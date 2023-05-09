aws cloudformation create-stack \
 --stack-name compose-infrastructure \
 --template-body file://cloudformation.yml \
 --capabilities CAPABILITY_IAM