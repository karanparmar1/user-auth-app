export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
