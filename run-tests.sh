#!/bin/bash

# Script to run tests in the project

# Default command runs tests in watch mode
if [ "$1" == "" ]; then
  npx vitest
elif [ "$1" == "run" ]; then
  # Run tests once without watch mode
  npx vitest run
elif [ "$1" == "coverage" ]; then
  # Run tests with coverage report
  npx vitest run --coverage
else
  echo "Unknown command: $1"
  echo "Available commands: run, coverage"
  exit 1
fi