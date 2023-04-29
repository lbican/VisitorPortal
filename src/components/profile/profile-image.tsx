import React from 'react';
import { Image } from '@chakra-ui/react';

interface ProfileImageProps {
    src: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src }) => {
    return (
        <Image
            src={src}
            alt="Profile Picture"
            borderRadius="full"
            boxSize="150px"
            shadow="lg"
            border="5px solid"
            mb={-20}
            borderColor="gray.800"
            _dark={{
                borderColor: 'gray.200',
            }}
        />
    );
};

export default ProfileImage;
