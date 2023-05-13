// profile-page.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Profile from '../../components/profile/profile';
import Skeleton from 'react-loading-skeleton';
import useUserProfile from '../../hooks/useUserProfile';
import EmptyState from '../../components/empty-state';

const ProfilePage: React.FC = () => {
    const { username = '' } = useParams<{ username: string }>();
    const { userProfile, isLoading } = useUserProfile(username);

    if (isLoading) {
        return <Skeleton height={500} />;
    }

    return userProfile ? (
        <Profile {...userProfile} />
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
