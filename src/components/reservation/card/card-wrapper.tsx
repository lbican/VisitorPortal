import React, { ReactNode } from 'react';
import { HStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { LuPlaneLanding, LuPlaneTakeoff } from 'react-icons/lu';

interface CardWrapperProps {
    isArriving: boolean;
    children: ReactNode;
}
export const CardWrapper: React.FC<CardWrapperProps> = ({ isArriving, children }) => {
    return (
        <HStack
            p={{ base: 3, sm: 6 }}
            bg={useColorModeValue('gray.100', 'gray.800')}
            spacing={5}
            rounded="md"
            alignItems="center"
            pos="relative"
            w="full"
            _before={{
                content: '""',
                w: '0',
                h: '0',
                borderColor: `transparent ${useColorModeValue('#edf2f6', '#1a202c')} transparent`,
                borderStyle: 'solid',
                borderWidth: '15px 15px 15px 0',
                position: 'absolute',
                left: '-15px',
                display: 'block',
            }}
        >
            <Icon
                as={isArriving ? LuPlaneLanding : LuPlaneTakeoff}
                w={12}
                h={12}
                color={isArriving ? 'blue.500' : 'red.500'}
                borderWidth={4}
                borderRadius="full"
                borderColor={isArriving ? 'blue.400' : 'red.400'}
            />
            {children}
        </HStack>
    );
};

export default CardWrapper;
