# Docker Deployment Guide

## Quick Start

### Build and Run
```bash
# Build the Docker image
docker build -t gena-dashboard .

# Run the container
docker run -p 3000:3000 gena-dashboard
```

### Using Docker Compose (Optional)
Create a `docker-compose.yml` file:
```yaml
version: '3.8'
services:
  gena-dashboard:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Then run:
```bash
docker-compose up -d
```

## Production Deployment

### Multi-stage Build
The Dockerfile uses a multi-stage build process:
1. **deps stage**: Installs production dependencies
2. **builder stage**: Builds the Next.js application
3. **runner stage**: Creates the final production image

### Security Features
- Runs as non-root user (`nextjs`)
- Uses Alpine Linux for smaller attack surface
- Minimal production dependencies

### Environment Variables
- `NODE_ENV=production`
- `NEXT_TELEMETRY_DISABLED=1`
- `PORT=3000`
- `HOSTNAME=0.0.0.0`

## Development vs Production

### Development
```bash
# For development, use the original Dockerfile
docker build -f Dockerfile.dev -t gena-dashboard:dev .
docker run -p 3000:3000 -v $(pwd):/app gena-dashboard:dev
```

### Production
```bash
# Production build (current Dockerfile)
docker build -t gena-dashboard:prod .
docker run -p 3000:3000 gena-dashboard:prod
```

## Troubleshooting

### Common Issues
1. **Port already in use**: Change the port mapping `-p 3001:3000`
2. **Build fails**: Ensure all dependencies are in package.json
3. **Container won't start**: Check logs with `docker logs <container-name>`

### Useful Commands
```bash
# View logs
docker logs gena-dashboard-container

# Stop container
docker stop gena-dashboard-container

# Remove container
docker rm gena-dashboard-container

# Remove image
docker rmi gena-dashboard
``` 