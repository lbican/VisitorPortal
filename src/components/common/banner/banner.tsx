import React from 'react';
import { Box } from '@chakra-ui/react';
import getRandomImage from '../../../utils/image';

interface ProfileImageProps {
    banner_url?: string;
    children: React.ReactNode;
}

const Banner: React.FC<ProfileImageProps> = ({ banner_url, children }) => {
    return (
        <Box
            bg="#edf3f8"
            _dark={{
                bg: '#3e3e3e',
            }}
            style={{
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%), url(${
                    banner_url ?? getRandomImage
                })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'brightness(0.8)', // Adjust the brightness value as needed
            }}
            height="100%"
            width="100%"
            borderRadius="lg"
            p={8}
            display="flex"
            alignItems="left"
        >
            {children}
        </Box>
    );
};

export default Banner;
