// UserProfileContext.tsx
import React, { useContext } from 'react';
import { UserProfile } from './auth-context';

type UserProfileContextType = {
    userProfile: UserProfile | null;
    refetch: () => void;
};

const UserProfileContext = React.createContext<UserProfileContextType | undefined>(
    undefined
);

export const UserProfileProvider = UserProfileContext.Provider;

export default UserProfileContext;

export const useProfileProvider = () => {
    const context = useContext(UserProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used inside of UserProfileProvider.');
    }
    return context;
};
