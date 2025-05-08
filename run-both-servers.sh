#!/bin/bash

# This script starts both the backend and frontend servers in separate processes

echo "Starting backend server on port 4000..."
NODE_ENV=development PORT=4000 tsx server/setup-server.ts &
BACKEND_PID=$!

echo "Starting frontend server on port 3000..."
NODE_ENV=development PORT=3000 tsx client/setup-client.ts &
FRONTEND_PID=$!

# Function to kill both processes on exit
function cleanup {
  echo "Shutting down servers..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
}

# Register the cleanup function on script exit
trap cleanup EXIT

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID