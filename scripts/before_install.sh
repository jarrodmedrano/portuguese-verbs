echo "DATABASE_URL=$(aws ssm get-parameter --name '/path/to/parameter' --with-decryption | jq '.Parameter.Value')" >> .env