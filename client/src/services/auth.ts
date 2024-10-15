import { AuthResponse, LoginCredentials, SignupCredentials, User } from '../types';
import api, { handleApiError } from '../utils/api';
import { API_ROUTES } from '../utils/constants';
import { removeAccessToken, removeRefreshToken, setAccessToken } from '../utils/storage';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>(API_ROUTES.LOGIN, credentials);

    setAccessToken(data.access_token);

    return data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>(API_ROUTES.SIGNUP, credentials);

    setAccessToken(data.access_token);

    return data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post(API_ROUTES.LOGOUT);

    removeAccessToken();
    removeRefreshToken();
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const { data } = await api.get<User>(API_ROUTES.CURRENT_USER);

    return data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data } = await api.get<User[]>(API_ROUTES.ALL_USERS);

    return data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
