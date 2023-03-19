import { useState } from 'react';

interface LocalStorageHook {
  value: string | null;
  setItem: (key: string, value: string) => void;
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
}

export const useLocalStorage = (): LocalStorageHook => {
  const [value, setValue] = useState<string | null>(null);

  const setItem = (key: string, value: string): void => {
    localStorage.setItem(key, value);
    setValue(value);
  };

  const getItem = (key: string): string | null => {
    const value = localStorage.getItem(key);
    setValue(value);
    return value;
  };

  const removeItem = (key: string): void => {
    localStorage.removeItem(key);
    setValue(null);
  };

  return { value, setItem, getItem, removeItem };
};
