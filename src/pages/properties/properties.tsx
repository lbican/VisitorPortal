import React, { ReactElement, useEffect } from 'react';
import { Button, Divider, Heading, HStack, useDisclosure, Wrap, WrapItem } from '@chakra-ui/react';
import Property from '../../components/property/property';
import { AiOutlinePlus } from 'react-icons/ai';
import PropertyActionModal from './form/property-action-modal';
import { useAuth } from '../../context/auth-context';
import AlertDialogComponent from '../../components/common/feedback/alert-dialog-component';
import { IProperty, ManagerType } from '../../utils/interfaces/typings';
import CustomContextMenu from '../../components/common/action/custom-context-menu';
import { observer } from 'mobx-react-lite';
import { propertyStore as store } from '../../mobx/propertyStore';
import useToastNotification from '../../hooks/useToastNotification';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ManagerModal from '../../components/property/manager/manager-modal';
import { AnimatePresence, motion } from 'framer-motion';

const Properties = (): ReactElement => {
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
    const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
    const {
        isOpen: isManagerModalOpen,
        onOpen: onManagerModalOpen,
        onClose: onManagerModalClose,
    } = useDisclosure();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const notification = useToastNotification();

    const openManagerModal = (property: IProperty) => {
        store.setCurrentProperty(property);
        onManagerModalOpen();
    };

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
                    notification.success(t('Successfully deleted property'));
                })
                .catch((e) => {
                    console.error(e);
                    notification.error(t('Could not delete property'));
                });
        }
    };

    const getPropertyCardAnimations = (index: number) => {
        return {
            hidden: { opacity: 0, y: -10 * index },
            show: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 10 },
        };
    };

    return (
        <>
            <motion.div
                key="properties"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <HStack mb={4} justifyContent="space-between">
                    <Heading as="h2" size="lg">
                        {t('Your properties')}
                    </Heading>
                    <Button leftIcon={<AiOutlinePlus />} colorScheme="green" onClick={onModalOpen}>
                        {t('Add new property')}
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
                    dialogBody={t('confirmDelete', {
                        propertyName: store.currentProperty?.name,
                    })}
                    dialogHeader={t('Confirm deletion')}
                    dialogConfirmText={t('Delete')}
                    dialogDeclineText={t('Cancel')}
                />
                <ManagerModal isOpen={isManagerModalOpen} onClose={onManagerModalClose} />
                <Divider mb={4} />
            </motion.div>
            <Wrap justifyContent={{ base: 'center', md: 'flex-start' }} spacing={4}>
                {store.properties.map((property, index) => (
                    <WrapItem key={property.id}>
                        <CustomContextMenu
                            isOwner={property.manager_type === ManagerType.OWNER}
                            onJumpToCalendar={() => {
                                store.setCurrentProperty(property);
                                navigate('/calendar');
                            }}
                            onMenuEdit={() => openEditModal(property)}
                            onMenuDelete={() => openDeleteAlert(property)}
                            onAddManagerClick={() => openManagerModal(property)}
                        >
                            <AnimatePresence>
                                <NavLink to={`/properties/property/${property.id}`}>
                                    <motion.div
                                        initial="hidden"
                                        animate="show"
                                        exit="exit"
                                        variants={getPropertyCardAnimations(index + 1)}
                                    >
                                        <Property property={property} />
                                    </motion.div>
                                </NavLink>
                            </AnimatePresence>
                        </CustomContextMenu>
                    </WrapItem>
                ))}
            </Wrap>
        </>
    );
};

export default observer(Properties);
