import React from 'react';
import BannerWrapper from '../common/banner/banner-wrapper';
import ProfileDetails from './profile-details';
import { UserProfile } from '../../context/auth-context';
import ProfileContainer from './profile-container';
import Banner from '../common/banner/banner';

const Profile: React.FC<UserProfile> = (props) => {
    return (
        <BannerWrapper>
            <Banner>
                <ProfileContainer {...props} />
            </Banner>
            <ProfileDetails {...props} />
        </BannerWrapper>
    );
};

export default Profile;
