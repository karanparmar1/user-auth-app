# User Authentication Fullstack
## Execute with Docker Compose:
   Build and run the Docker containers:
   ```
   docker-compose up --build
   ```
   - Or For Fresh clean build
     ```
     docker compose down
     docker compose build --no-cache
     docker compose up
     ```
   The application UI will be available at `http://localhost:5173`.

# [BACKEND] User Authentication - server

This is the backend for a user authentication system built with NestJS, MongoDB, and TypeScript.

## Prerequisites

- Node.js (v18.19.0)
- MongoDB
- Docker (optional)

## Setup

1. Clone the repository:

   ```
   git clone <repository-url>
   cd server
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```
   # SERVER CONFIGS
   MONGO_URI=mongodb://localhost:27017/user-auth-db
   PORT=3000

   # SECRETS
   JWT_SECRET=zxcv_my_security_key_zxcv
   JWT_EXPIRATION=1h
   REFRESH_TOKEN_SECRET=asdfg_my_top_secret_key_asdfg
   REFRESH_TOKEN_EXPIRATION=7d

   # CLIENT CONFIGS
   FRONTEND_URL=http://localhost:5173
   ```

## Running the app

### With Docker

1. Build and run the Docker containers:
   ```
   docker-compose up --build
   ```
   - Or For Fresh clean build
     ```
     docker compose down
     docker compose build --no-cache
     docker compose up
     ```

The application will be available at `https://localhost:3000`.

### Without Docker

1. Start your local MongoDB server.

2. Run the application:

   ```
   # development
   npm run start

   # watch mode
   npm run start:dev

   # production mode
   npm run start:prod
   ```

The application will be available at `https://localhost:3000`.

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## API Endpoints

- `POST /auth/signup`: Create a new user account
- `POST /auth/login`: Authenticate a user and receive access token
- `GET /auth/me`: Get the current user's profile (protected route)
- `POST /auth/refresh`: Refresh the access token
- `POST /auth/logout`: Logout and invalidate the refresh token
- `GET /users`: Get a list of all users (protected route)

## Security Measures

- Password hashing using bcryptjs
- JWT for authentication
- Refresh token rotation
- CORS configuration
- Helmet for setting various HTTP headers
- Cookie security for refresh tokens
- Input validation using class-validator

## Logging

The application uses nestjs-pino for logging. Logs are output to the console in development and can be configured for production environments.

## Error Handling

A global exception filter is implemented to catch and format all exceptions thrown by the application.

## Future Scope

- [ ] Add password reset
- [ ] Implement role-based access control (RBAC) for admin and normal user
- [ ] Add email OTP verification for new user accounts
- [ ] Implement two-factor authentication / OAuth
- [ ] Implement API documentation using Swagger
- [ ] rate limiting


# [FRONTEND] User Authentication UI

This is the frontend part of the User Authentication application. It's built with React, TypeScript, Tailwind and Vite.

## Features

- User registration
- User login
- Protected dashboard route
- Password strength meter
- CSRF token protection
- Secure token storage using HTTP-only cookies
- Responsive design using Tailwind CSS

## Prerequisites

- Node.js v18+
- npm or yarn

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/user-auth-app.git
   cd user-auth-app/client
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root of the client directory and add the following:
   ```
   VITE_API_URL=https://localhost:3000
   VITE_PORT=5173
   VITE_ENCRYPTION_KEY=zxcv_rAnDoM_kEy_fOr_eNc_zxcv
   ```

## Running the Application

To start the development server:

```
npm run dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

To create a production build:

```
npm run build
```

The built files will be in the `dist` directory.

## Running with Docker

To run the frontend with Docker:

1. Build the Docker image:

   ```
   docker build -t user-auth-frontend .
   ```

2. Run the Docker container:
   ```
   docker run -p 5173:5173 user-auth-frontend
   ```

The application will be available at `http://localhost:5173`.

## Testing

To run the tests:

```
npm run test
```

## Security Measures

- CSRF token protection for all API requests
- Secure storage of tokens using HTTP-only cookies
- Password strength validation
- Input validation and sanitization
- HTTPS-only communication with the backend

## Future Improvements

- [ ] Add password reset functionality
- [ ] Implement OAuth authentication
- [ ] Add user profile management features

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
