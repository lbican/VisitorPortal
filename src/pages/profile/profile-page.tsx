import React from 'react';
import { useParams } from 'react-router-dom';
import Profile from '../../components/profile/profile';
import useUserProfile from '../../hooks/useUserProfile';
import EmptyState from '../../components/common/feedback/empty-state';
import { UserProfileProvider } from '../../context/user-profile-context';
import { Skeleton } from '@chakra-ui/react';

const ProfilePage: React.FC = () => {
    const { username = '' } = useParams<{ username: string }>();
    const { userProfile, refetch, isLoading } = useUserProfile(username);

    const contextValue = {
        userProfile,
        refetch,
    };

    if (isLoading) {
        return <Skeleton height="221px" />;
    }

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
