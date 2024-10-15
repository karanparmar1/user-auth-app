import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { STORAGE_KEYS } from './constants';
import { decrypt, encrypt } from './encryption';

export const setStorageItem = (key: string, value: string): void => {
  const encryptedValue = encrypt(value);
  localStorage.setItem(key, encryptedValue);
};

export const getStorageItem = (key: string): string | null => {
  const encryptedValue = localStorage.getItem(key);
  if (encryptedValue) {
    return decrypt(encryptedValue);
  }
  return null;
};

export const removeStorageItem = (key: string): void => {
  localStorage.removeItem(key);
};

export const setAccessToken = (token: string): void => {
  setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const getAccessToken = (): string | null => {
  return getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const removeAccessToken = (): void => {
  removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const isTokenValid = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    return decodedToken.exp ? decodedToken.exp * 1000 > Date.now() : false;
  } catch {
    return false;
  }
};

export const setRefreshToken = (token: string): void => {
  Cookies.set(STORAGE_KEYS.REFRESH_TOKEN, encrypt(token), { secure: true, sameSite: 'strict' });
};

export const getRefreshToken = (): string | null => {
  const encryptedToken = Cookies.get(STORAGE_KEYS.REFRESH_TOKEN);
  return encryptedToken ? decrypt(encryptedToken) : null;
};

export const removeRefreshToken = (): void => {
  Cookies.remove(STORAGE_KEYS.REFRESH_TOKEN);
};
