export interface UserRegistration {
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
  email: string;
  password: string;
  repeat_password: string;
}

export interface User extends Omit<UserRegistration, 'password' | 'repeat_password'> {
  token: string;
}

export interface StorageHook {
  value: string | null;
  setItem: (key: string, value: string) => void;
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
}
