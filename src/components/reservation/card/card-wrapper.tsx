import React, { ReactNode } from 'react';
import { HStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface CardWrapperProps {
    icon: IconType;
    children: ReactNode;
}
export const CardWrapper: React.FC<CardWrapperProps> = ({ icon, children }) => {
    return (
        <HStack
            p={{ base: 3, sm: 6 }}
            bg={useColorModeValue('gray.100', 'gray.800')}
            spacing={5}
            rounded="lg"
            alignItems="center"
            pos="relative"
            _before={{
                content: '""',
                w: '0',
                h: '0',
                borderColor: `transparent ${useColorModeValue(
                    '#edf2f6',
                    '#1a202c'
                )} transparent`,
                borderStyle: 'solid',
                borderWidth: '15px 15px 15px 0',
                position: 'absolute',
                left: '-15px',
                display: 'block',
            }}
        >
            <Icon as={icon} w={12} h={12} color="blue.500" />
            {children}
        </HStack>
    );
};

export default CardWrapper;
