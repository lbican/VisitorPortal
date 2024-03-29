import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

interface Props {
    code: number;
    shortMessage: string;
    message: string;
    hideButton?: boolean;
}

const EmptyState: React.FC<Props> = ({ code, shortMessage, message, hideButton }) => {
    return (
        <Box textAlign="center" py={10} px={6}>
            <Heading
                display="inline-block"
                as="h2"
                size="2xl"
                backgroundClip="text"
                color="blue.500"
            >
                {code}
            </Heading>
            <Text fontSize="18px" mt={3} mb={2}>
                {shortMessage}
            </Text>
            <Text mb={6}>{message}</Text>

            {!hideButton && (
                <Button color="white" variant="solid" colorScheme="blue" as={NavLink} to="/">
                    Go to Home
                </Button>
            )}
        </Box>
    );
};

export default EmptyState;
