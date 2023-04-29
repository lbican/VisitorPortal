import React from 'react';
import { Flex } from '@chakra-ui/react';
import ProfileImage from './profile-image';
import ProfileBanner from './profile-banner';

interface ProfileHeaderProps {
    avatar_src: string;
    children: React.ReactNode;
}

const ProfileWrapper: React.FC<ProfileHeaderProps> = ({ avatar_src, children }) => {
    return (
        <Flex
            shadow="lg"
            rounded="lg"
            bg="#edf3f8"
            _dark={{
                bg: 'gray.800',
            }}
            mb={8}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <ProfileBanner>
                <ProfileImage src={avatar_src} />
            </ProfileBanner>
            {children}
        </Flex>
    );
};

export default ProfileWrapper;
