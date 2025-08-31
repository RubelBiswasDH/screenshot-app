# Docker Setup for Screenshot App

This project includes a simple Docker configuration for the NestJS screenshot application.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

```bash
# Build and start the application
docker compose up --build

# Or run in background
docker compose up -d --build
```

## Docker Commands

### Build and run

```bash
docker compose up --build
```

### Stop containers

```bash
docker compose down
```

### View logs

```bash
docker compose logs -f
```

### Rebuild containers

```bash
docker compose up --build --force-recreate
```

## Access the Application

Once running, the application will be available at:

- **URL**: http://localhost:3000

## Features

- **Node.js 24** with Alpine Linux
- **Hot reloading** for development
- **Puppeteer support** with Chromium browser
- **Security** with non-root user execution
- **Volume mounting** for code changes

## Environment Variables

The following environment variables are automatically set:

- `NODE_ENV`: development
- `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`: true
- `PUPPETEER_EXECUTABLE_PATH`: /usr/bin/chromium-browser

## Troubleshooting

### If Puppeteer fails to launch

The Docker setup includes all necessary dependencies for Puppeteer to work with Chromium.

### If you need to install additional packages

Edit the Dockerfile and add the required packages to the `apk add` command.

### Port conflicts

If port 3000 is already in use, modify the port mapping in `docker-compose.yml`:

```yaml
ports:
  - '3001:3000' # Use port 3001 instead
```
