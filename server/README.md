# QueueLess Backend API

REST API server for **QueueLess — AI Enhanced Digital Queue and Smart Token Management System**.

## Architectural Overview

The backend strictly follows a layered architectural pattern with clear separation of concerns:

- **Routes (`src/routes/`)**: Define endpoints, wire middleware, validate schemas, and dispatch to controllers.
- **Controllers (`src/controllers/`)**: Handle HTTP request processing and responses using standardized envelopes.
- **Services (`src/services/`)**: Enforce business rules, priority calculations, token generation, and wait time estimations.
- **Models (`src/models/`)**: Mongoose data schemas, indexing, and validation constraints.
- **Validators (`src/validators/`)**: Joi schemas guarding request payloads.
- **Middleware (`src/middleware/`)**: Authentication (JWT), role checking, central error capturing, and rate-limiting.
- **Sockets (`src/sockets/`)**: Foundation for real-time queue notifications and updates.
- **Jobs (`src/jobs/`)**: Background task runners for queue maintenance.

## API Versioning

All endpoints are versioned under `/api/v1/`:

- Health Check: `GET /api/v1/health`
- Auth: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`
- Services: `GET /api/v1/services`, `POST /api/v1/services`
- Appointments: `POST /api/v1/appointments`, `GET /api/v1/appointments/my`
- Tokens: `POST /api/v1/tokens/walk-in`, `POST /api/v1/tokens/check-in`, `GET /api/v1/tokens/my`
- Queue: `GET /api/v1/queue/:serviceId/live`, `POST /api/v1/queue/call-next`
- Counters: `GET /api/v1/counters`, `POST /api/v1/counters`
- Analytics: `GET /api/v1/analytics/overview`

## Getting Started

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Verify server status:
   ```bash
   curl http://localhost:5000/api/v1/health
   ```
