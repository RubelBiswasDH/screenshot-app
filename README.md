# screenshot-app

NestJS REST API that captures PNG screenshots of a given URL, protected by an API key.

## API Documentation

### Base URL

```
http://localhost:3000
```

### Endpoints

#### GET /

Returns a hello message.

- **Response**: `string` - Hello message

#### GET /screenshot

Captures a screenshot of the provided URL.

- **Query Parameters**:
  - `url` (string, required): The URL to capture a screenshot of
- **Headers**:
  - `x-key` (string, required): API key (must match `EXTERNAL_KEY`)
- **Response**: PNG image of the screenshot
- **Errors**:
  - `401 Unauthorized`: Invalid or missing API key

#### GET /screenshot/run-status

Returns the current run status of the screenshot service.

- **Response**: JSON object with status information

### Authentication

Screenshot endpoints require an API key in the `x-key` header. Set the `EXTERNAL_KEY` environment variable with your desired key.

## Docker

### Build

```bash
docker build -t screenshot-app .
```

### Run

```bash
docker run -p 3000:3000 screenshot-app
```

The app will be available at `http://localhost:3000`.

For Docker Compose and more detail, see [DOCKER_README.md](DOCKER_README.md).

### Environment Variables

- `EXTERNAL_KEY`: API key for screenshot endpoints (set at build or runtime)

## Project setup

```bash
npm install
```

## Compile and run

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Run tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Stay in touch

- Author - [Rubel Biswas](https://x.com/RubelBiswasCS)
- Website - [www.rubelbiswas.com](https://www.rubelbiswas.com)
- Twitter - [@RubelBiswasCS](https://x.com/RubelBiswasCS)

## License

This project is [MIT licensed](LICENSE).
