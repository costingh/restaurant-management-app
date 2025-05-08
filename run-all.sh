#!/bin/bash
npx concurrently "bash ./run-backend.sh" "bash ./run-frontend.sh"