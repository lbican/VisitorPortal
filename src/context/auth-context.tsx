import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { Session } from '@supabase/supabase-js';
import supabase from '../../database';

export interface CurrentUser {
  avatar_url: string;
  email: string;
  email_verified: boolean;
  full_name: string;
  iss: string;
  name: string;
  picture: string;
  provider_id: string;
  sub: string;
}

interface AuthType {
  user: CurrentUser | null;
  session: Session | null;
  signOut: () => void;
}

export const AuthContext = createContext<AuthType>({
  user: null,
  session: null,
  signOut: () => {},
});

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const getSession = async (): Promise<Session | null> => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUserSession(session);
        setUser((session?.user.user_metadata as CurrentUser) ?? null);
        return Promise.resolve(session);
      } catch (error) {
        return Promise.reject(error);
      }
    };

    getSession()
      .then((session) => {
        console.log(session);
      })
      .catch((error) => {
        console.error(error);
      });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Supabase auth event: ${event}`);
      setUserSession(session);
      setUser((session?.user.user_metadata as CurrentUser) ?? null);
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
        setUserSession(null);
      })
      .catch((error) => console.error(error));
  };

  const authContextValue = useMemo(
    () => ({ user: user, session: userSession, signOut }),
    [user, userSession]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a AuthContextProvider.');
  }
  return context;
};
