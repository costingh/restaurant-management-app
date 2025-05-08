#!/bin/bash
echo "Starting backend and frontend servers..."
npx concurrently "bash ./run-backend-server.sh" "bash ./run-frontend-server.sh"