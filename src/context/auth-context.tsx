import React, { createContext, ReactNode, useMemo, useState } from 'react';
import { User } from '../utils/interfaces/typings';
import { useStorage } from '../hooks/useStorage';

export interface AuthContextType {
  user: User | null;
  login: (authorizedUser: User, rememberUser: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [storageType, setStorageType] = useState<'local' | 'session'>('local');
  const storage = useStorage(storageType);

  const login = (authorizedUser: User, rememberUser: boolean): void => {
    const newStorageType = rememberUser ? 'local' : 'session';
    setStorageType(newStorageType);

    storage.setItem('user', JSON.stringify(authorizedUser));
    setUser(authorizedUser);
  };

  const logout = (): void => {
    storage.removeItem('user');
    setUser(null);
  };

  const authContextValue = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  // Check for user in storage on component mount
  React.useEffect(() => {
    const storedUser = storage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [storage]);

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
