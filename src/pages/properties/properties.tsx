import React, { ReactElement } from 'react';
import { Button, Flex, Heading, HStack } from '@chakra-ui/react';
import Property from '../../components/property/property';
import { AiOutlinePlus } from 'react-icons/ai';
import { MOCK_PROPERTIES } from '../../utils/mocks/properties';

const Properties = (): ReactElement => {
    return (
        <>
            <HStack mb={4} justifyContent="space-between">
                <Heading as="h2" size="lg">
                    Your properties
                </Heading>
                <Button leftIcon={<AiOutlinePlus />} colorScheme="green">
                    Add new property
                </Button>
            </HStack>
            <Flex alignItems="flex-start" flexWrap="wrap">
                {MOCK_PROPERTIES.map((MOCK_PROPERTY) => (
                    <Property key={MOCK_PROPERTY.id} property={MOCK_PROPERTY} />
                ))}
            </Flex>
        </>
    );
};

export default Properties;
