#!/bin/bash
set -e
who
pwd
ls -ltr
CONTENT=$(cat /app/apps/client/.env.production); 
echo "$CONTENT"
# cat /app/apps/client/.env.production | sed "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" > /app/apps/client/.env.production
sed -i "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" /app/apps/client/.env.production
sed -i "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" /app/apps/client/server.js
CONTENT2=$(cat /app/apps/client/.env.production); 
echo "$CONTENT2"
# echo "$CONTENT" | sed "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" > /app/apps/client/.env.production

echo "I am root"
exec "$@"
