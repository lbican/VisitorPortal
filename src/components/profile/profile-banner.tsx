import React from 'react';
import { Box } from '@chakra-ui/react';

interface ProfileImageProps {
    banner_url?: string;
    children: React.ReactNode;
}

const DEFAULT_BANNER =
    'https://images.unsplash.com/photo-1666795599746-0f62dfa29a07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80';

const ProfileBanner: React.FC<ProfileImageProps> = ({ banner_url, children }) => {
    return (
        <Box
            bg="#edf3f8"
            _dark={{
                bg: '#3e3e3e',
            }}
            style={{
                backgroundImage: `url(${banner_url || DEFAULT_BANNER})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
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

export default ProfileBanner;
