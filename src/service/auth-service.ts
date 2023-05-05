import { Provider, Session, User } from '@supabase/supabase-js';
import supabase from '../../database';
import { UserRegistration } from '../utils/interfaces/typings';

interface EmailLogin {
    user: User | null;
    session: Session | null;
}

interface TokenLogin {
    provider: Provider;
    url: string;
}

export class AuthService {
    static async oauthLogin(provider: Provider): Promise<TokenLogin> {
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

    static async emailLogin(email: string, password: string): Promise<EmailLogin> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            return Promise.reject(error);
        }

        return Promise.resolve(data);
    }

    static async signUpUser(user: UserRegistration) {
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
