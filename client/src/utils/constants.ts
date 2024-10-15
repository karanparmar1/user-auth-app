export const CONFIG = {
  PORT: import.meta.env.VITE_PORT,
  API_URL: import.meta.env.VITE_API_URL,
};

export const API_ROUTES = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  CURRENT_USER: '/auth/me',
  CSRF: '/auth/csrf',
  ALL_USERS: '/users',
};

export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNAUTHORIZED: 'You are not authorized to access this resource',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
};

export const SECRETS = {
  // SALT_ROUNDS: 10,
  // REFRESH_TOKEN_EXPIRATION: import.meta.env.REFRESH_TOKEN_EXPIRATION,
  // REFRESH_TOKEN_SECRET: import.meta.env.REFRESH_TOKEN_SECRET,
  // JWT_SECRET: import.meta.env.JWT_SECRET,
  // JWT_EXPIRATION: import.meta.env.JWT_EXPIRATION,
  ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY,
};

export const REGEX = {
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};
