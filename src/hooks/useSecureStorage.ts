
import { useState, useEffect } from 'react';

interface SecureStorageOptions {
  encrypt?: boolean;
  expiry?: number; // Time in milliseconds
}

export const useSecureStorage = <T>(
  key: string, 
  defaultValue: T, 
  options: SecureStorageOptions = {}
) => {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  // Simple encryption for sensitive data (in a real app, use proper encryption)
  const encryptData = (data: string): string => {
    if (!options.encrypt) return data;
    return btoa(data); // Basic base64 encoding (use proper encryption in production)
  };

  const decryptData = (data: string): string => {
    if (!options.encrypt) return data;
    try {
      return atob(data);
    } catch {
      return '';
    }
  };

  const getStoredValue = (): T => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      const parsedItem = JSON.parse(item);
      
      // Check expiry
      if (options.expiry && parsedItem.expiry && Date.now() > parsedItem.expiry) {
        localStorage.removeItem(key);
        return defaultValue;
      }

      const decryptedData = decryptData(parsedItem.data);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error reading from secure storage:', error);
      return defaultValue;
    }
  };

  const setStoredValue = (newValue: T) => {
    try {
      const dataToStore = {
        data: encryptData(JSON.stringify(newValue)),
        ...(options.expiry && { expiry: Date.now() + options.expiry }),
      };
      
      localStorage.setItem(key, JSON.stringify(dataToStore));
      setValue(newValue);
    } catch (error) {
      console.error('Error writing to secure storage:', error);
    }
  };

  const removeStoredValue = () => {
    try {
      localStorage.removeItem(key);
      setValue(defaultValue);
    } catch (error) {
      console.error('Error removing from secure storage:', error);
    }
  };

  useEffect(() => {
    const storedValue = getStoredValue();
    setValue(storedValue);
    setLoading(false);
  }, []);

  return {
    value,
    setValue: setStoredValue,
    removeValue: removeStoredValue,
    loading,
  };
};
