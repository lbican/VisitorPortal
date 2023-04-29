import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { User } from '@supabase/supabase-js';
import supabase from '../../database';
import _ from 'lodash';

interface AuthType {
    user: User | null;
    signOut: () => void;
}

export const AuthContext = createContext<AuthType>({
    user: null,
    signOut: () => {},
});

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const storedUser = localStorage.getItem('user');
    const [user, setUser] = useState<User | null>(storedUser ? JSON.parse(storedUser) : null);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`Supabase auth event: ${event}`);
            const newUser: User = session?.user.user_metadata as User;

            if (!_.isEqual(user, newUser)) {
                setUser(newUser ?? null);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const memoizedUser = useMemo(() => user, [user]);

    const signOut = () => {
        supabase.auth
            .signOut()
            .then(() => {
                setUser(null);
            })
            .catch((error) => console.error(error));
    };

    const authContextValue = useMemo(() => ({ user: memoizedUser, signOut }), [memoizedUser]);

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthContextProvider.');
    }
    return context;
};
