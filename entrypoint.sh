#!/bin/bash
set -e
 
sed -i "s|uniquevalue|${NEXT_PUBLIC_TRPC_API}|g" .env.production
 
exec "$@"