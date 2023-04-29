import React from 'react';
import ProfileWrapper from './profile-wrapper';
import ProfileDetails from './profile-details';

interface ProfileProps {
    full_name: string;
    avatar_url: string;
    email: string;
    job_title: string;
    location: string;
}

const Profile: React.FC<ProfileProps> = ({ full_name, avatar_url, email, job_title, location }) => {
    return (
        <ProfileWrapper avatar_src={avatar_url}>
            <ProfileDetails
                full_name={full_name}
                email={email}
                job_title={job_title}
                location={location}
            />
        </ProfileWrapper>
    );
};

export default Profile;
