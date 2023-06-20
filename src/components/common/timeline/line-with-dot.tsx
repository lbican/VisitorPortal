import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const LineWithDot = () => {
    const dotColor = useColorModeValue('whitesmoke', 'gray.700');
    return (
        <Flex pos="relative" alignItems="center" mr="40px">
            <Text
                as="span"
                position="absolute"
                left="50%"
                height="calc(100% + 10px)"
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'blue.700')}
                top="0px"
            ></Text>
            <Box pos="relative" p="10px">
                <Box
                    pos="absolute"
                    width="100%"
                    height="100%"
                    bottom="0"
                    right="0"
                    top="0"
                    left="0"
                    backgroundSize="cover"
                    backgroundRepeat="no-repeat"
                    backgroundPosition="center center"
                    backgroundColor="rgb(255, 255, 255)"
                    borderRadius="100px"
                    border="3px solid #63B3ED"
                    background={dotColor}
                    opacity={1}
                ></Box>
            </Box>
        </Flex>
    );
};

export default LineWithDot;
