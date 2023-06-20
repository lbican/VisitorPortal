import React, { ReactNode } from 'react';
import { Box, Spinner, useColorModeValue } from '@chakra-ui/react';

interface ChartContainerProps {
    children: ReactNode;
    isLoaded: boolean;
}
const ChartContainer: React.FC<ChartContainerProps> = ({ children, isLoaded }) => {
    const backgroundColor = useColorModeValue('gray.100', 'gray.800');

    return (
        <Box
            p={4}
            rounded="lg"
            boxShadow={useColorModeValue(
                '0 4px 6px rgba(160, 174, 192, 0.6)',
                '2px 4px 6px rgba(9, 17, 28, 0.9)'
            )}
            backgroundColor={backgroundColor}
            color="white"
        >
            {isLoaded ? children : <Spinner />}
        </Box>
    );
};

export default ChartContainer;
