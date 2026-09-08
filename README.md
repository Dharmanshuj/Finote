# Fitness Application Microservices

A fitness-tracking application built with Spring Boot microservices and a React frontend. Users authenticate with OAuth2, record fitness activities, and receive AI-generated recommendations.

## Architecture

```text
React client -> API Gateway -> User Service      -> PostgreSQL
                          -> Activity Service    -> MongoDB
                          -> AI Service          -> MongoDB

Activity Service -> RabbitMQ -> AI Service -> Gemini API

Config Server supplies configuration; Eureka provides service discovery.
```

## Services

| Service | Port | Purpose |
| --- | ---: | --- |
| Config Server | 8888 | Centralized application configuration |
| Eureka | 8761 | Service discovery |
| API Gateway | 8080 | Routing and OAuth2 JWT validation |
| User Service | 8081 | User profiles and validation |
| Activity Service | 8082 | Activity tracking |
| AI Service | 8083 | AI recommendation generation |
| Frontend | 5173 | React and Vite web client |

## Prerequisites

- JDK 23 for the User, Activity, AI, and Gateway services
- JDK 17 or later for Config Server and Eureka
- Node.js and npm
- PostgreSQL
- MongoDB
- RabbitMQ
- Keycloak
- Gemini API credentials

## Configuration

The Config Server holds service configuration in `configserver/src/main/resources/config`.

Set these environment variables before starting the AI Service:

```text
GEMINI_API_URL=<Gemini generate-content endpoint including query separator>
GEMINI_API_KEY=<Gemini API key>
```

Update the database, RabbitMQ, and Keycloak settings to match the local environment before running the application.

## Run locally

Start infrastructure dependencies first, then launch services in this order:

1. Config Server
2. Eureka
3. User Service
4. Activity Service
5. AI Service
6. API Gateway
7. Frontend

For each backend service:

```powershell
./mvnw.cmd spring-boot:run
```

For the frontend:

```powershell
cd fitness-app-frontend
npm install
npm run dev
```

Open `http://localhost:5173` after the frontend starts.

## API routes

The API Gateway exposes the following route groups:

- `/api/users/**`
- `/api/activities/**`
- `/api/recommendations/**`
