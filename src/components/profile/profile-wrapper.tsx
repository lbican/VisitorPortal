import React from 'react';
import { Flex } from '@chakra-ui/react';

const ProfileWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
            {children}
        </Flex>
    );
};

export default ProfileWrapper;
