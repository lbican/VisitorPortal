import { useState } from 'react';
import { StorageHook } from '../utils/interfaces/typings';

export const useStorage = (storageType: 'local' | 'session'): StorageHook => {
  const [value, setValue] = useState<string | null>(null);
  const storage = storageType === 'local' ? localStorage : sessionStorage;

  const setItem = (key: string, value: string): void => {
    storage.setItem(key, value);
    setValue(value);
  };

  const getItem = (key: string): string | null => {
    const value = storage.getItem(key);
    setValue(value);
    return value;
  };

  const removeItem = (key: string): void => {
    storage.removeItem(key);
    setValue(null);
  };

  return { value, setItem, getItem, removeItem };
};
