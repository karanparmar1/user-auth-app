import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';
import { ApiError, AuthResponse } from '../types';
import { API_ROUTES, CONFIG, ERROR_MESSAGES } from './constants';
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
} from './storage';

const api: AxiosInstance = axios.create({
  baseURL: CONFIG.API_URL,
  withCredentials: true,
});

let isFetchingCSRF = false;

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // set access token in the Authorization header
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || new AxiosHeaders();
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // set csrf token in the X-XSRF-TOKEN header
    let csrfToken = Cookies.get('XSRF-TOKEN');
    if (!csrfToken && !isFetchingCSRF) {
      isFetchingCSRF = true;
      try {
        const csrfResponse = await api.get(API_ROUTES.CSRF);

        csrfToken = csrfResponse.data.token;
        if (csrfToken) Cookies.set('XSRF-TOKEN', csrfToken);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      } finally {
        isFetchingCSRF = false;
      }
    }

    if (csrfToken) {
      config.headers = config.headers || {};
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }

    // Return the modified request configuration
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // If no error directly return response
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check if the original request was for login
    if (originalRequest.url === API_ROUTES.LOGIN) {
      return Promise.reject(error); // Propagate the error and prevent token refresh
    }

    // Handle 401 Unauthorized response and and if the request has not been retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true; // set request for retry to prevent infinite loops

      try {
        const refresh_token = getRefreshToken();
        if (!refresh_token) {
          throw new Error('No refresh token available');
        }

        // Send request to refresh the access token
        const {
          data: { access_token },
        } = await api.post<AuthResponse>(API_ROUTES.REFRESH_TOKEN);

        // Store new access token
        setAccessToken(access_token);

        // Update the Authorization header with the new refreshed access token
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        }

        // Retry original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user and redirect to login page
        removeAccessToken();
        removeRefreshToken();

        // window.location.href = '/login'; // Redirect to Login

        return Promise.reject(refreshError); // Propagate the eror
      }
    }

    // If the error is not 401 or the retry has already been attempted,
    // reject and propagate the error
    return Promise.reject(error);
  }
);

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error as AxiosError<ApiError>;
    const apiMessage = apiError.response?.data?.message;
    if (typeof apiMessage === 'string') {
      return apiMessage;
    } else if ((apiMessage as any)?.message) {
      return (apiMessage as any)?.message;
    } else {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

export default api;

export const fetchCsrfToken = async (): Promise<void> => {
  try {
    const response = await api.get(API_ROUTES.CSRF);
    Cookies.set('XSRF-TOKEN', response.data.token);
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
};
