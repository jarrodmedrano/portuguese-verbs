#!/bin/sh

# List directory content
echo "Listing directory content of /app"
ls -al /app

# Run your main process
echo "Starting server..."
node /app/apps/client/server.js
next reload-env