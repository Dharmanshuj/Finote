# Finote

Finote is the current name and visual theme for the React frontend in this repository. The application logic and backend are still a fitness activity tracker: users sign in with Keycloak, record running, walking, or cycling sessions, and can receive AI-generated fitness feedback. The Finote rebrand is currently presentation-only; it does not turn the stored data or AI output into personal finance records or advice.

## Architecture

```text
React frontend -> API Gateway -> User Service      -> PostgreSQL
                             -> Activity Service  -> MongoDB
                             -> AI Service        -> MongoDB

Activity Service -> RabbitMQ -> AI Service -> Gemini API

Config Server provides configuration; Eureka provides service discovery.
Keycloak authenticates users and issues JWTs checked by the API Gateway.
```

## Services and ports

| Service | Port | Purpose |
| --- | ---: | --- |
| Config Server | 8888 | Centralized application configuration |
| Eureka | 8761 | Service discovery dashboard |
| API Gateway | 8080 | API routing and OAuth2 JWT validation |
| User Service | 8081 | User profiles and validation |
| Activity Service | 8082 | Activity tracking |
| AI Service | 8083 | AI-generated activity recommendations |
| Keycloak | 8181 | Login and token issuance (configured by the frontend) |
| Finote frontend | 5173 | React and Vite web client |

## Requirements

- JDK 23 for User, Activity, AI, and Gateway services
- JDK 17 or later for Config Server and Eureka
- Maven (there is no Maven wrapper in the repository)
- Node.js and npm
- PostgreSQL, MongoDB, RabbitMQ, and Keycloak
- Gemini API credentials for AI-generated recommendations

## Configuration

The Config Server loads YAML files from `configserver/src/main/resources/config`.

Before starting the services, configure the database, message broker, and identity provider for your environment:

- User Service reads PostgreSQL settings from `PGHOST`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD`, with optional `PGSSLMODE` and `PGCHANNELBINDING` settings.
- Activity Service and AI Service are configured to connect to MongoDB at `localhost:27017` and RabbitMQ at `localhost:5672` by default.
- The frontend authorization and token endpoints point to `http://localhost:8181/realms/fitness-oauth2/...`. Set up Keycloak at that address with the `fitness-oauth2` realm and the `oauth2-pkce-client` client. Configure the client to allow the redirect URI `http://localhost:5173`.
- The API Gateway retrieves Keycloak signing keys from the same realm at port `8181`.
- AI Service requires `GEMINI_API_URL` and `GEMINI_API_KEY`. `GEMINI_API_URL` should be the Gemini generate-content endpoint ending with the query prefix expected by the code (for example, `...?key=`); the service appends the key to that URL.

Keep credentials in local environment settings and do not commit secrets to the repository.

## Run locally

Start PostgreSQL, MongoDB, RabbitMQ, and Keycloak first. Ensure their ports and credentials match the configuration above. Keep each application running in its own terminal.

From the repository root, start the Spring Boot services in this order:

1. Config Server

   ```powershell
   mvn -f configserver/pom.xml spring-boot:run
   ```

2. Eureka

   ```powershell
   mvn -f eureka/pom.xml spring-boot:run
   ```

3. User Service

   ```powershell
   mvn -f userservice/pom.xml spring-boot:run
   ```

4. Activity Service

   ```powershell
   mvn -f activityservice/pom.xml spring-boot:run
   ```

5. AI Service

   Set `GEMINI_API_URL` and `GEMINI_API_KEY` in this terminal, replacing the placeholders with your Gemini endpoint and key, then run:

   ```powershell
   $env:GEMINI_API_URL = "<Gemini generate-content endpoint ending in ?key=>"
   $env:GEMINI_API_KEY = "<your Gemini API key>"
   mvn -f aiservice/pom.xml spring-boot:run
   ```

   AI recommendations require valid Gemini credentials. Activity logging can still be used without Gemini only if the AI Service configuration is adjusted to allow missing credentials.

6. API Gateway

   ```powershell
   mvn -f gateway/pom.xml spring-boot:run
   ```

7. Finote frontend, in another terminal

   ```powershell
   cd finote-frontend
   npm install
   npm run dev
   ```

Open `http://localhost:5173`. The frontend sends API requests through the gateway on port `8080` and redirects sign-in to Keycloak on port `8181`. If login reports `ERR_CONNECTION_REFUSED`, check that Keycloak is running and reachable at the configured URL.

## API routes

The API Gateway exposes these route groups:

- `/api/users/**`
- `/api/activities/**`
- `/api/recommendations/**`
