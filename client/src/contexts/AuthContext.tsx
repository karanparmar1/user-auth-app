import { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { AuthResponse, LoginCredentials, SignupCredentials, User } from '../types';
import api, { handleApiError } from '../utils/api';
import { API_ROUTES } from '../utils/constants';
import {
  getAccessToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
} from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signup: (credentials: SignupCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get<User>(API_ROUTES.CURRENT_USER);
      setUser(response.data);
    } catch (error) {
      setUser(null);
      console.error('Failed to fetch user:', error);

      throw new Error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>(API_ROUTES.LOGIN, credentials);
      setAccessToken(data.access_token);

      await fetchUser();
      return data;
    } catch (error) {
      console.error({ error });
      throw new Error(handleApiError(error));
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>(API_ROUTES.SIGNUP, credentials);
      setAccessToken(data.access_token);

      await fetchUser();
      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  };

  const logout = async () => {
    await api.post(API_ROUTES.LOGOUT);
    removeAccessToken();
    removeRefreshToken();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user?.email, isLoading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
