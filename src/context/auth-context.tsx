import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import supabase from '../../database';
import { UserService } from '../services/user-service';
import { StorageService } from '../services/storage-service';
import { propertyStore } from '../mobx/propertyStore';
import { reservationStore } from '../mobx/reservationStore';

export interface UserProfile {
    id: string;
    username: string | null;
    full_name: string;
    email: string;
    created_at: string;
    updated_at: string | null;
    avatar_url: string | null;
}

interface AuthType {
    user: UserProfile | null;
    loadingUser: boolean;
    signOut: () => void;
}

const AuthContext = createContext<AuthType>({
    user: null,
    loadingUser: false,
    signOut: () => {},
});

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const userService = new UserService();
    const [user, setUser] = useState<UserProfile | null>(StorageService.getUserFromStorage());
    const [loadingUser, setLoadingUser] = useState(false);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`Supabase auth event: ${event}`);

            const fetchAuthorizedUser = async () => {
                setLoadingUser(true);
                try {
                    userService.setSession(session);
                    const userProfile = await userService.getAuthorizedUser();
                    setUser(userProfile);
                } catch (error) {
                    setUser(null);
                    console.error(error);
                } finally {
                    setLoadingUser(false);
                }
            };

            void fetchAuthorizedUser();
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const signOut = () => {
        supabase.auth
            .signOut()
            .then(() => {
                propertyStore.resetStore();
                reservationStore.resetStore();
                StorageService.removeUserFromStorage();
                setUser(null);
            })
            .catch((error) => console.error(error));
    };

    const authContextValue = useMemo(
        () => ({ user: user, signOut, loadingUser }),
        [user, loadingUser]
    );

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthContextProvider.');
    }
    return context;
};
