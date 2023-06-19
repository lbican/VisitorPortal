import React, { ReactNode } from 'react';
import { Box, Spinner, useColorModeValue } from '@chakra-ui/react';

interface ChartContainerProps {
    children: ReactNode;
    isLoaded: boolean;
}
const ChartContainer: React.FC<ChartContainerProps> = ({ children, isLoaded }) => {
    const backgroundColor = useColorModeValue('white', '#1A202C');

    return (
        <Box p={4} rounded="lg" boxShadow="lg" backgroundColor={backgroundColor} color="white">
            {isLoaded ? children : <Spinner />}
        </Box>
    );
};

export default ChartContainer;
