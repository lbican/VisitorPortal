import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import supabase from '../../database';

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
    signOut: () => void;
}

const AuthContext = createContext<AuthType>({
    user: null,
    signOut: () => {},
});

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const storedUser = localStorage.getItem('user');
    const [user, setUser] = useState<UserProfile | null>(
        storedUser ? JSON.parse(storedUser) : null
    );

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`Supabase auth event: ${event}`);
            const { user } = session || {};
            if (user) {
                const { data, error } = await supabase
                    .from('Profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (error) {
                    console.error(error);
                } else {
                    console.log(data);
                    console.log(user);
                    setUser((data as UserProfile) ?? null);
                    localStorage.setItem('user', JSON.stringify(data));
                }
            } else {
                setUser(null);
                localStorage.removeItem('user');
            }
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const signOut = () => {
        supabase.auth
            .signOut()
            .then(() => {
                setUser(null);
                localStorage.removeItem('user');
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
