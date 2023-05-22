import { Provider, Session, User } from '@supabase/supabase-js';
import supabase from '../../database';
import { IUserRegistration } from '../utils/interfaces/typings';

interface EmailAuthData {
    user: User | null;
    session: Session | null;
}

interface OAuthData {
    provider: Provider;
    url: string;
}

export class AuthService {
    static async oauthLogin(provider: Provider): Promise<OAuthData> {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                queryParams: {
                    prompt: 'consent',
                },
            },
        });

        if (error) {
            return Promise.reject(error);
        }

        return Promise.resolve(data);
    }

    static async emailLogin(email: string, password: string): Promise<EmailAuthData> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            return Promise.reject(error);
        }

        return Promise.resolve(data);
    }

    static async signUpUser(user: IUserRegistration): Promise<EmailAuthData> {
        const { data, error } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
                data: {
                    full_name: user.first_name + ' ' + user.last_name,
                    username: user.username,
                    avatar_url: user.avatar,
                },
            },
        });

        if (error) {
            return Promise.reject(error);
        }

        return Promise.resolve(data);
    }
}
