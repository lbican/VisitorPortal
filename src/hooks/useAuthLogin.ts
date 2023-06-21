import { useState } from 'react';
import { AuthError, Provider } from '@supabase/supabase-js';
import { AuthService } from '../services/auth-service';

export const useAuthForm = () => {
    const [error, setError] = useState<AuthError | null>(null);
    const [loadingToken, setLoadingToken] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const loginUserWithToken = (provider: Provider) => {
        setError(null);
        setLoadingToken(true);

        AuthService.oauthLogin(provider)
            .catch((error) => {
                setError(error as AuthError);
            })
            .finally(() => {
                setLoadingToken(false);
            });
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

    return { loginUserWithToken, loginUserWithEmail, error, loading, loadingToken };
};
