import { useState, useEffect } from 'react';
import { UserService } from '../services/user-service';
import { UserProfile } from '../context/auth-context';
import { PostgrestError } from '@supabase/supabase-js';

const useUserProfile = (username: string) => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<PostgrestError | null>(null);

    useEffect(() => {
        UserService.getUserProfile(username)
            .then((user) => {
                setUserProfile(user);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [username]);

    return { userProfile, isLoading, error };
};

export default useUserProfile;
