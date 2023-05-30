BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name compose-pipeline --query "Stacks[0].Outputs[?OutputKey=='S3BucketName'].OutputValue" --output text)

git archive --format=zip HEAD -o compose-bundle.zip
aws s3 cp compose-bundle.zip s3://$BUCKET_NAME/compose-bundle.zip