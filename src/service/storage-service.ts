import { UserProfile } from '../context/auth-context';

export class StorageService{
    static getUserFromStorage(): UserProfile | null {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            return JSON.parse(storedUser);
        }

        return null;
    }

    static saveUserToLocalStorage(user: UserProfile) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    static removeUserFromStorage(): void {
        localStorage.removeItem('user');
    }
}
