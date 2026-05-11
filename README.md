# Task Management REST API

A robust, production-ready RESTful API for task management, built with Node.js, Express, and TypeScript. This project demonstrates modular architecture, strict data validation, and automated testing.

## Features

- **Authentication**: JWT-based auth with `register`, `login`, and `me` endpoints.
- **Task Management**: Full CRUD operations with strict ownership enforcement (403 Forbidden).
- **Advanced Filtering**: Search, filter by status/priority, and paginated results on task lists.
- **Validation**: Strict request body and query parameter validation using Joi.
- **Documentation**: Interactive OpenAPI (Swagger) UI available at `/api/docs`.
- **Security**: 
    - Password hashing with Bcrypt (saltRounds: 10).
    - Rate limiting to prevent brute force.
    - Security headers and sanitized JSON responses (toJSON overrides).
- **Quality Assurance**: Comprehensive unit tests and E2E tests using Jest and `mongodb-memory-server`.
- **Logging**: Request logging with Morgan.

---

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Joi
- **Auth**: JsonWebToken (JWT) & Bcryptjs
- **Testing**: Jest & Supertest
- **Documentation**: Swagger (swagger-jsdoc & swagger-ui-express)

---

##  Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (refer to `.env.example`):
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/task_management
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
```

### 4. Running the App
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Production**: `npm start`

---

## Testing

The project uses `mongodb-memory-server` for zero-config testing. No real database is required to run the suites.

- **Unit Tests**: `npm test` (Focuses on AuthService and TasksService logic)
- **E2E Tests**: `npm run test:e2e` (Validates full API flows)

---

## API Documentation

Once the server is running, access the interactive documentation at:
**`http://localhost:3000/api/docs`**

---

## Project Structure

```text
src/
  ├── config/        # Database & Env configurations
  ├── controllers/   # Request/Response handlers
  ├── services/      # Core business logic (AuthService, TasksService)
  ├── models/        # Mongoose User and Task schemas
  ├── middleware/    # Auth (JWT) and Validation (Joi)
  ├── validations/   # Joi Schema definitions
  ├── common/        # AppError and Global Error Handler
  ├── app.ts         # Express configuration
  └── server.ts      # Server entry point
```

---
