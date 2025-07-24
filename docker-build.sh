#!/bin/bash

# Build the Docker image
echo "Building Docker image..."
docker build -t gena-dashboard .

# Run the container
echo "Running container..."
docker run -p 3000:3000 --name gena-dashboard-container gena-dashboard

echo "Docker container is running on http://localhost:3000" 