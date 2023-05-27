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
import { IProperty } from '../../utils/interfaces/typings';

const Properties = (): ReactElement => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
    const { user } = useAuth();
    const { properties, refetch, isLoading, setProperties } = useUserProperties(user?.id);
    const [currentProperty, setCurrentProperty] = useState<IProperty | null>(null);
    const [editingProperty, setEditingProperty] = useState<IProperty | undefined>();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const openEditModal = (property: IProperty) => {
        setEditingProperty(property);
        onOpen();
    };

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

    const openDeleteAlert = (property: IProperty) => {
        setCurrentProperty(property);
        onOpenAlert();
    };

    const confirmDeleteProperty = () => {
        if (currentProperty) {
            deleteProperty(currentProperty.id);
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
            <PropertyActionModal
                property={editingProperty}
                isOpen={isOpen}
                onClose={() => {
                    onClose();
                    setEditingProperty(undefined);
                }}
                refetch={refetch}
            />
            <AlertDialogComponent
                isLoading={isDeleting}
                isOpen={isOpenAlert}
                onClose={onCloseAlert}
                onConfirm={confirmDeleteProperty}
                dialogBody={`Are you sure you want to delete ${currentProperty?.name}`}
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
                                onMenuEdit={() => openEditModal(property)}
                                onMenuDelete={() => openDeleteAlert(property)}
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
