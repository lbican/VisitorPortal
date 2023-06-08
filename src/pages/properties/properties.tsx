import React, { ReactElement, useEffect } from 'react';
import { Button, Divider, Flex, Heading, HStack, useDisclosure } from '@chakra-ui/react';
import Property from '../../components/property/property';
import { AiOutlinePlus } from 'react-icons/ai';
import PropertyActionModal from './form/property-action-modal';
import { useAuth } from '../../context/auth-context';
import AlertDialogComponent from '../../components/common/feedback/alert-dialog-component';
import { IProperty } from '../../utils/interfaces/typings';
import CustomContextMenu from '../../components/common/action/custom-context-menu';
import { observer } from 'mobx-react-lite';
import { propertyStore as store } from '../../mobx/propertyStore';
import useToastNotification from '../../hooks/useToastNotification';
import { NavLink } from 'react-router-dom';

const Properties = (): ReactElement => {
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
    const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
    const { user } = useAuth();
    const notification = useToastNotification();

    useEffect(() => {
        void store.fetchProperties(user?.id);
    }, [store, user]);

    const openEditModal = (property: IProperty) => {
        store.setEditingProperty(property);
        onModalOpen();
    };

    const openDeleteAlert = (property: IProperty) => {
        store.setCurrentProperty(property);
        onOpenAlert();
    };

    const confirmDeleteProperty = () => {
        if (store.currentProperty) {
            store
                .deleteProperty(store.currentProperty.id, store.currentProperty.image_path)
                .then(() => {
                    onCloseAlert();
                    notification.success('Successfully deleted property');
                })
                .catch((e) => {
                    console.error(e);
                    notification.error('Could not delete property');
                });
        }
    };

    return (
        <>
            <HStack mb={4} justifyContent="space-between">
                <Heading as="h2" size="lg">
                    Your properties
                </Heading>
                <Button leftIcon={<AiOutlinePlus />} colorScheme="green" onClick={onModalOpen}>
                    Add new property
                </Button>
            </HStack>
            <PropertyActionModal
                isOpen={isModalOpen}
                onClose={() => {
                    onModalClose();
                    store.setEditingProperty(undefined);
                }}
            />
            <AlertDialogComponent
                isLoading={store.isDeleting}
                isOpen={isOpenAlert}
                onClose={onCloseAlert}
                onConfirm={confirmDeleteProperty}
                dialogBody={`Are you sure you want to delete ${store.currentProperty?.name}`}
                dialogHeader="Confirm deletion"
            />
            <Divider mb={4} />
            <Flex alignItems="flex-start" flexWrap="wrap">
                {store.properties.map((property) => (
                    <CustomContextMenu
                        key={property.id}
                        onMenuEdit={() => openEditModal(property)}
                        onMenuDelete={() => openDeleteAlert(property)}
                    >
                        <NavLink
                            to={`/properties/property/${property.id}`}
                            onClick={() => store.setCurrentProperty(property)}
                        >
                            <Property property={property} />
                        </NavLink>
                    </CustomContextMenu>
                ))}
            </Flex>
        </>
    );
};

export default observer(Properties);
