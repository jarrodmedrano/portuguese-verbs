#!/bin/bash
set -e
who
pwd
ls -ltr
CONTENT=$(cat /app/apps/client/.env.production); 
echo "$CONTENT"
# cat /app/apps/client/.env.production | sed "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" > /app/apps/client/.env.production
# sed -i "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" /app/apps/client/.env.production
# sed -i "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" /app/apps/client/server.js
# sed -i "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" /app/apps/client/server.js
# sed -i "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" /app/apps/client/.next/server/app/index.html
# sed -i "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" /app/apps/client/.next/server/app/page.js
# sed -i "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" /app/apps/client/.next/server/app/page.js
# sed -i "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" /app/apps/client/.next/required-server-files.json
# sed -i "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" /apps/client/.next
find /app/apps/client/ -type f -exec sed -i "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" {} \;

CONTENT2=$(cat /app/apps/client/.env.production); 
echo "$CONTENT2"
# echo "$CONTENT" | sed "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" > /app/apps/client/.env.production

echo "I am root"
exec "$@"
