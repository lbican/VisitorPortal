import React from 'react';
import ProfileWrapper from './profile-wrapper';
import ProfileDetails from './profile-details';
import { UserProfile } from '../../context/auth-context';
import ProfileContainer from './profile-container';
import ProfileBanner from './profile-banner';

const Profile: React.FC<UserProfile> = (props) => {
    return (
        <ProfileWrapper>
            <ProfileBanner>
                <ProfileContainer {...props} />
            </ProfileBanner>
            <ProfileDetails {...props} />
        </ProfileWrapper>
    );
};

export default Profile;
