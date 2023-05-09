import React from 'react';
import ProfileWrapper from './profile-wrapper';
import ProfileDetails from './profile-details';
import { UserProfile } from '../../context/auth-context';

const Profile: React.FC<UserProfile> = (props) => {
    return (
        <ProfileWrapper avatar_src={props.avatar_url || ''}>
            <ProfileDetails {...props} />
        </ProfileWrapper>
    );
};

export default Profile;
