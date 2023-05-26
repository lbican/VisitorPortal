import React, { ReactElement } from 'react';
import { Button, Divider, Flex, Heading, HStack, useDisclosure } from '@chakra-ui/react';
import Property from '../../components/property/property';
import { AiOutlinePlus } from 'react-icons/ai';
import { MOCK_PROPERTIES } from '../../utils/mocks/properties';
import PropertyActionModal from '../../components/property/modal/property-action-modal';

const Properties = (): ReactElement => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <HStack mb={4} justifyContent="space-between">
                <Heading as="h2" size="lg">
                    Your properties
                </Heading>
                <Button leftIcon={<AiOutlinePlus />} colorScheme="green" onClick={onOpen}>
                    Add new property
                </Button>
            </HStack>
            <PropertyActionModal property={null} isOpen={isOpen} onClose={onClose} />
            <Divider mb={4} />
            <Flex alignItems="flex-start" flexWrap="wrap">
                {MOCK_PROPERTIES.map((MOCK_PROPERTY) => (
                    <Property key={MOCK_PROPERTY.id} property={MOCK_PROPERTY} />
                ))}
            </Flex>
        </>
    );
};

export default Properties;
