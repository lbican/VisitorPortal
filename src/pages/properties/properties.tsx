import React, { ReactElement, useState } from 'react';
import { Button, Divider, Flex, Heading, HStack, useDisclosure, Text } from '@chakra-ui/react';
import Property from '../../components/property/property';
import { AiOutlinePlus } from 'react-icons/ai';
import PropertyActionModal from '../../components/property/modal/property-action-modal';
import { useAuth } from '../../context/auth-context';
import useUserProperties from '../../hooks/useUserProperties';
import PropertyService from '../../services/property-service';
import CustomContextMenu from '../../components/common/custom-context-menu';
import AlertDialogComponent from '../../components/common/alert-dialog-component';

const Properties = (): ReactElement => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
    const { user } = useAuth();
    const { properties, refetch, isLoading, setProperties } = useUserProperties(user?.id);
    const [currentPropertyId, setCurrentPropertyId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const deleteProperty = (propertyId: string) => {
        setIsDeleting(true);
        PropertyService.deletePropertyById(propertyId)
            .then(() => {
                setProperties(properties.filter((prop) => prop.id !== propertyId));
                onCloseAlert();
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => setIsDeleting(false));
    };

    const openDeleteAlert = (propertyId: string) => {
        setCurrentPropertyId(propertyId);
        onOpenAlert();
    };

    const confirmDeleteProperty = () => {
        if (currentPropertyId) {
            deleteProperty(currentPropertyId);
        }
    };

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
            <AlertDialogComponent
                isLoading={isDeleting}
                isOpen={isOpenAlert}
                onClose={onCloseAlert}
                onConfirm={confirmDeleteProperty}
                dialogBody="Are you sure you want to delete a property?"
                dialogHeader="Confirm deletion"
            />
            <Divider mb={4} />
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <>
                    <Flex alignItems="flex-start" flexWrap="wrap">
                        {properties.map((property) => (
                            <CustomContextMenu
                                key={property.id}
                                onMenuDelete={() => openDeleteAlert(property.id)}
                            >
                                <Property property={property} />
                            </CustomContextMenu>
                        ))}
                    </Flex>
                </>
            )}
        </>
    );
};

export default Properties;
