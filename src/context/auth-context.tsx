import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { User } from '@supabase/supabase-js';
import supabase from '../../database';

interface AuthType {
    user: User | null;
    signOut: () => void;
}

export const AuthContext = createContext<AuthType>({
    user: null,
    signOut: () => {},
});

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`Supabase auth event: ${event}`);
            const user: User = session?.user.user_metadata as User;

            setUser(user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const signOut = () => {
        supabase.auth
            .signOut()
            .then(() => {
                setUser(null);
            })
            .catch((error) => console.error(error));
    };

    const authContextValue = useMemo(() => ({ user: user, signOut }), [user]);

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthContextProvider.');
    }
    return context;
};
