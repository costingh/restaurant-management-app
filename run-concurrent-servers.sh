#!/bin/bash

# This script uses concurrently to start both backend and frontend servers
# With nice formatting and colors

# Make sure the script is executable
# chmod +x run-concurrent-servers.sh

# The backend server will run on port 4000 (NestJS)
# The frontend server will run on port 3000 (React with Vite)

# Install concurrently if not already installed
if ! command -v npx &> /dev/null; then
  echo "npx not found. Please make sure you have Node.js installed."
  exit 1
fi

echo "Starting backend and frontend servers concurrently..."

# Use concurrently to run both servers with nice labels and colors
npx concurrently -n "backend,frontend" -c "blue,green" \
  "NODE_ENV=development PORT=4000 tsx server/main.ts" \
  "NODE_ENV=development PORT=3000 tsx client/setup-client.ts"