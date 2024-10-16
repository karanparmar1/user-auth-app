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

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
