import React, { ReactElement } from 'react';
import { Button, Divider, Flex, Heading, HStack, useDisclosure, Text } from '@chakra-ui/react';
import Property from '../../components/property/property';
import { AiOutlinePlus } from 'react-icons/ai';
import PropertyActionModal from '../../components/property/modal/property-action-modal';
import { useAuth } from '../../context/auth-context';
import useUserProperties from '../../hooks/useUserProperties';

const Properties = (): ReactElement => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = useAuth();
    const { properties, refetch, isLoading, error } = useUserProperties(user?.id);

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
            <PropertyActionModal isOpen={isOpen} onClose={onClose} refetch={refetch} />
            <Divider mb={4} />
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <Flex alignItems="flex-start" flexWrap="wrap">
                    {properties.map((property) => (
                        <Property key={property.id} property={property} />
                    ))}
                </Flex>
            )}
        </>
    );
};

export default Properties;
