import { Session, User } from '@supabase/supabase-js';
import supabase from '../../database';
import { UserProfile } from '../context/auth-context';
import { StorageService } from './storage-service';

export class UserService {
    private session: Session | null;

    constructor(session: Session | null) {
        this.session = session;
    }

    setSession(session: Session | null): void {
        this.session = session;
    }

    getUser(): User | undefined {
        return this.session?.user;
    }

    getUserProfile = async (): Promise<UserProfile | null> => {
        if (!this.session) {
            StorageService.removeUserFromStorage();
            return Promise.resolve(null);
        }

        const { user } = this.session;
        const { data, error } = await supabase
            .from('Profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            return Promise.reject(error);
        }

        StorageService.saveUserToLocalStorage(data as UserProfile);
        return Promise.resolve(data as UserProfile);
    };

}
