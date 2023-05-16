import React from 'react';
import { useParams } from 'react-router-dom';
import Profile from '../../components/profile/profile';
import useUserProfile from '../../hooks/useUserProfile';
import EmptyState from '../../components/empty-state';
import { UserProfileProvider } from '../../context/user-profile-context';

const ProfilePage: React.FC = () => {
    const { username = '' } = useParams<{ username: string }>();
    const { userProfile, refetch } = useUserProfile(username);

    const contextValue = {
        userProfile,
        refetch,
    };

    return userProfile ? (
        <UserProfileProvider value={contextValue}>
            <Profile {...userProfile} />
        </UserProfileProvider>
    ) : (
        <EmptyState
            code={404}
            shortMessage="Error has occured"
            message="Requested user was not found"
            hideButton={true}
        />
    );
};

export default ProfilePage;
