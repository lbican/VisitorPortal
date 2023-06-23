import React, { ReactNode } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';

interface ContentWrapperProps {
    children: ReactNode;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
    return (
        <Box
            flex="1"
            bg={useColorModeValue('gray.50', 'gray.700')}
            padding="4"
            roundedTopLeft="md"
            shadow="sm"
        >
            <AnimatePresence>{children}</AnimatePresence>
        </Box>
    );
};

export default ContentWrapper;
