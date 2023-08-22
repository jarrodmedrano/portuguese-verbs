for r in $(grep 'image: 606387284755.dkr.ecr.us-east-2.amazonaws.com' docker-compose.yml | sed -e 's/^.*\///')
  do
    aws ecr create-repository --repository-name "$r"
  done