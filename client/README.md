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
