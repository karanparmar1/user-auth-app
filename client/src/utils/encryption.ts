import CryptoJS from 'crypto-js';
import { SECRETS } from './constants';

export const encrypt = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRETS.ENCRYPTION_KEY).toString();
};

export const decrypt = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRETS.ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
