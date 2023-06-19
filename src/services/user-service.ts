import { Session, User } from '@supabase/supabase-js';
import supabase from '../../database';
import { UserProfile } from '../context/auth-context';
import { StorageService } from './storage-service';
import { pickBy, identity } from 'lodash';

export class UserService {
    private session: Session | null;

    constructor(session?: Session) {
        this.session = session || null;
    }

    setSession(session: Session | null): void {
        this.session = session;
    }

    getUser(): User | undefined {
        return this.session?.user;
    }

    getAuthorizedUser = async (): Promise<UserProfile | null> => {
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

    static getUserProfile = async (username?: string): Promise<UserProfile> => {
        if (!username) {
            return Promise.reject('Cannot fetch user with undefined username');
        }

        const { data, error } = await supabase
            .from('Profiles')
            .select('*')
            .eq('username', username)
            .single();

        if (error) {
            return Promise.reject(error);
        }

        return Promise.resolve(data as UserProfile);
    };

    static searchNonManagers = async (
        searchTerm: string,
        propertyId?: string
    ): Promise<UserProfile[]> => {
        if (!propertyId) {
            throw new Error('Property id is undefined!');
        }

        const { data, error } = await supabase.rpc('get_non_managers', {
            property_id: propertyId,
            search_term: searchTerm,
        });

        if (error) {
            throw error;
        }

        return data as UserProfile[];
    };

    static updateUserProfile = async (
        id: string | undefined,
        userProfileUpdate: Partial<UserProfile>
    ): Promise<void> => {
        if (!id) {
            return Promise.reject('User id cannot be undefined!');
        }

        // Remove undefined properties from the update object
        const cleanedProfileUpdate = pickBy(userProfileUpdate, identity);

        // Ensure that the id field is not being updated
        delete cleanedProfileUpdate.id;

        const { error } = await supabase.from('Profiles').update(cleanedProfileUpdate).eq('id', id);

        if (error) {
            return Promise.reject(error);
        } else {
            await supabase.auth.refreshSession();
        }
    };
}
