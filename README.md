# Calendar Booking API

A backend service that allows users to schedule meetings while preventing overlapping time slots, built with Node.js, TypeScript, Express, Sequelize, PostgreSQL, and Redis.

This project follows clean architecture principles, enforces business rules at the service layer, and includes production-grade features like authentication, caching, pagination, rate limiting, and logging.

---

## Tech Stack

- Node.js + Express

- TypeScript

- PostgreSQL

- Sequelize ORM

- Redis (ioredis)

- JWT Authentication

- Joi Validation

- Winston Logging

- Rate Limiting

- rate-limiter-flexible (global)

- express-rate-limit + Redis (sensitive endpoints)

---

## Project Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd calendar-booking-api
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables Setup

Create a `.env` file in the root directory:

```env
PORT=3000

DATABASE_URL=postgres://username:password@localhost:5432/calendar_db

JWT_SECRET=your_jwt_secret

REDIS_URL=redis://localhost:6379
```

### 4️⃣ Database Setup (PostgreSQL)

Create the database manually:

```bash
CREATE DATABASE calendar_db;
```

Sequelize will automatically create tables on startup using sequelize.sync().

### 5️⃣ Redis Setup

Ensure Redis is running locally:
redis-server

## Running the Application

Development Mode

```bash
npm run dev
```

Production Build

```bash
npm run build
npm start
```

## Architecture & Folder Structure

```text
src/
│
├── config/
│   ├── database.ts        # Sequelize DB configuration
│   └── redis.ts           # Redis client configuration
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── basicRateLimiter.middleware.ts
│   └── error.middleware.ts
│
├── modules/
│   ├── user/
│   │   ├── index/         # Controllers
│   │   ├── dto/           # Joi validation schemas
│   │   ├── interface/     # TypeScript interfaces
│   │   ├── module/        # Sequelize models
│   │   └── service/       # Business logic
│   │
│   └── meeting/
│       ├── index/
│       ├── dto/
│       ├── interface/
│       ├── module/
│       └── service/
│
├── routes/
│   ├── user.routes.ts
│   └── meeting.routes.ts
│
├── utils/
│   ├── cache.ts
│   └── logger.ts
│
├── app.ts                # Express app setup
└── index.ts              # Application bootstrap
```

## Architecture Design

This project follows a **layered architecture** pattern to ensure separation of concerns, scalability, and maintainability.

---

### Controller Layer

**Responsibilities:**

- Handles HTTP requests and responses only
- Extracts request data and passes it to services
- Sends formatted responses back to the client

**Key Rules:**

- No business logic
- No database queries
- Only request–response handling

---

### Service Layer

**Responsibilities:**

- Contains core business logic
- Enforces application rules and validations
- Acts as the single source of truth for workflows

**Includes:**

- Meeting conflict detection
- Ownership and access enforcement
- Cache handling and invalidation
- Data transformation before persistence

---

### DTO Layer

**Responsibilities:**

- Validates incoming request payloads
- Ensures data consistency and safety

**Tools Used:**

- Joi schemas for request validation

**Benefits:**

- Prevents invalid data from reaching service layer
- Improves API reliability and error handling

---

### Module Layer

**Responsibilities:**

- Defines Sequelize models
- Handles database interactions
- Maps application entities to database tables

**Includes:**

- Model definitions
- Associations and relations
- Query-level database operations

## Database Design

### User Table

| Field    | Type    | Constraints        |
| -------- | ------- | ------------------ |
| id       | INTEGER | PK, Auto Increment |
| name     | STRING  | NOT NULL           |
| email    | STRING  | UNIQUE, NOT NULL   |
| password | STRING  | NOT NULL           |

### Meeting Table

| Field     | Type      | Constraints        |
| --------- | --------- | ------------------ |
| id        | INTEGER   | PK, Auto Increment |
| userId    | INTEGER   | FK → users.id      |
| startTime | TIMESTAMP | NOT NULL           |
| endTime   | TIMESTAMP | NOT NULL           |
| createdAt | TIMESTAMP | Auto               |
| updatedAt | TIMESTAMP | Auto               |

## Relationships

- **User** → **Meetings** : `1 → N`
- One user can create multiple meetings
- Each meeting belongs to **exactly one user**

---

## Business Constraint (Critical Rule)

To maintain schedule integrity, **meetings must not overlap for the same user**.

### Rule

A user **cannot create or update** a meeting if its time range overlaps with any existing meeting owned by the same user.

---

### Conflict Detection Logic

The conflict check is enforced in the **service layer** using the following condition:

```ts
existing.startTime < new.endTime && existing.endTime > new.startTime;
```

## API Documentation

### User APIs

#### Create User (Spec-compliant)

**Endpoint**
POST /users

**Request Body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123"
}
```

#### Login User

**Endpoint**
POST /users/login

**Request Body**

```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

Response

```json
{
  "token": "jwt-token"
}
```

### Get User by ID

```bash
GET /users/:id
Authorization: Bearer <token>
```

## Meeting APIs

### Create Meeting

```bash
POST /meetings
Authorization: Bearer <token>
```

**Request Body**

```json
{
  "startTime": "2026-04-01T10:00:00.000Z",
  "endTime": "2026-04-01T11:00:00.000Z"
}
```

### Overlapping request response:

**Request Body**

```json
{
  "message": "Time slot already booked"
}
```

### Get Meetings (Pagination)

```bash
GET /meetings?page=1&limit=10
Authorization: Bearer <token>
```

**Request Body**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### Get Meeting by ID

```bash
GET /meetings/:id
Authorization: Bearer <token>
```

### Update Meeting

```bash
PUT /meetings/:id
Authorization: Bearer <token>
```

### Delete Meeting

```bash
DELETE /meetings/:id
Authorization: Bearer <token>
```

## Caching Strategy

- Redis is used for caching read-heavy endpoints
- Cache is scoped **per user** to ensure data isolation

### Cached Endpoints

- `GET /meetings`
- `GET /meetings/:id`

### Cache Bypass

- Date-filtered meeting queries bypass cache to ensure accuracy

### Cache Invalidation

- Cache is invalidated on **Create** meeting
- Cache is invalidated on **Update** meeting
- Cache is invalidated on **Delete** meeting

## Rate Limiting

- **Global Limiter**
  - Applied to all incoming requests
  - Protects against request floods and abuse

- **Sensitive Endpoint Limiter**
  - Applied to authentication and write operations
  - Prevents brute-force and misuse of critical APIs

- **Storage**
  - Redis-backed for distributed and consistent rate limiting

## Logging

- Winston logger used for centralized logging
- Logs application **errors**
- Logs **rate-limit violations**
- Logs important **application events**

## Validation & Error Handling

- Joi schemas used for validating all incoming inputs
- Meaningful and consistent error messages returned to clients
- Proper HTTP status codes are enforced:
  - **400** – Validation error / business conflict
  - **401** – Unauthorized access
  - **404** – Resource not found
  - **429** – Rate limit exceeded
  - **500** – Internal server error

## Assumptions & Tradeoffs

### Assumptions

- Meetings are strictly **user-specific**
- Time zones are handled using **ISO 8601 timestamps**
- Backend is implemented as a **single service** (no microservices)

### Tradeoffs

- Date-filtered meeting queries are **not cached** to avoid cache explosion
- Redis **KEYS** command is used for cache invalidation (acceptable for current scope)

## Bonus Features Implemented

- JWT-based authentication
- Redis caching
- Pagination support
- Rate limiting
- Centralized logging
- Strict TypeScript configuration
- Clean, layered architecture
