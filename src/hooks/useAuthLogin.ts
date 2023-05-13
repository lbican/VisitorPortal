import { useState } from 'react';
import { AuthError, Provider } from '@supabase/supabase-js';
import { AuthService } from '../services/auth-service';

export const useAuthForm = () => {
    const [error, setError] = useState<AuthError | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const loginUserWithToken = async (provider: Provider) => {
        try {
            await AuthService.oauthLogin(provider);
        } catch (error) {
            setError(error as AuthError);
        }
    };

    const loginUserWithEmail = async (email: string, password: string) => {
        setError(null);
        setLoading(true);

        try {
            await AuthService.emailLogin(email, password);
        } catch (error) {
            setError(error as AuthError);
        } finally {
            setLoading(false);
        }
    };

    return { loginUserWithToken, loginUserWithEmail, error, loading };
};
