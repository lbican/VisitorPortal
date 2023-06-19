import React from 'react';
import EmptyStateImage from '../../assets/images/empty-state.svg';
import { Image, Text, VStack } from '@chakra-ui/react';
export const NoData = () => {
    return (
        <VStack w="full">
            <Image
                src={EmptyStateImage}
                alt="Empty calendar"
                objectFit="contain"
                boxSize="xl"
            />
            <Text fontSize="xl">No data to display. Start adding!</Text>
        </VStack>
    );
};

export default NoData;
