import React, { ReactElement, useEffect, useState } from 'react';
import {
    Alert,
    AlertIcon,
    Box,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Heading,
    HStack,
    IconButton,
    Spinner,
    useBreakpointValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import DataTable from './table/data-table';
import { motion } from 'framer-motion';
import { ILabel } from '../../components/common/input/autocomplete';
import { propertyStore as store } from '../../mobx/propertyStore';
import { IUnit } from '../../utils/interfaces/typings';
import { SingleValue } from 'chakra-react-select';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../../context/auth-context';
import { reservationStore } from '../../mobx/reservationStore';
import { useNavigate } from 'react-router-dom';
import ReservationActions from '../../components/common/action/reservations-header';
import { CgMenuRightAlt } from 'react-icons/cg';

const Reservations = (): ReactElement => {
    const { t } = useTranslation();
    const isLargerScreen = useBreakpointValue({ base: false, lg: true });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [unit, setUnit] = useState<IUnit | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        void store.fetchProperties(user?.id);
    }, [store, user]);

    useEffect(() => {
        if (!unit) {
            reservationStore.setReservations([]);
        }

        reservationStore.fetchUnitReservations(unit?.id);
    }, [unit]);

    useEffect(() => {
        return () => {
            reservationStore.setReservations([]);
        };
    }, []);

    const handlePropertySelect = (newValue: SingleValue<ILabel>) => {
        newValue && store.getCurrentProperty(newValue.value);
        reservationStore.setReservations([]);
        setUnit(null);
    };

    const handleUnitSelect = (newValue: SingleValue<ILabel>) => {
        if (!store.currentProperty?.units || !newValue) {
            return null;
        }

        const unitIndex = store.currentProperty.units.findIndex(
            (unit) => unit.id == newValue.value
        );

        if (unitIndex > -1) {
            setUnit(store.currentProperty.units[unitIndex]);
        }
    };

    const renderReservations = () => {
        if (reservationStore.status === 'loading') {
            return (
                <Flex justifyContent="center" alignItems="center" height="80%">
                    <Spinner size="xl" />
                </Flex>
            );
        }

        if (reservationStore.status === 'failed') {
            return (
                <Alert status="error">
                    <AlertIcon />
                    {t('Error loading reservations')}
                </Alert>
            );
        }

        if (reservationStore.reservations.length === 0) {
            if (!unit) {
                return (
                    <Alert status="info" mb={2} rounded={4}>
                        <AlertIcon />
                        {t(
                            'Please select property and unit to be able to view and manage reservations'
                        )}
                    </Alert>
                );
            }

            return (
                <Alert status="warning" mb={2} rounded={4}>
                    <AlertIcon />
                    {t('No reservations found!')}
                </Alert>
            );
        }

        return (
            <DataTable
                data={reservationStore.reservations}
                unit={unit}
                getRowCanExpand={() => true}
            />
        );
    };

    return (
        <motion.div
            key="reservations"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <HStack justifyContent="space-between" mb={4}>
                <Heading as="h2" size="lg">
                    {t('Reservations')}
                </Heading>
                <>
                    {isLargerScreen ? (
                        <HStack>
                            <ReservationActions
                                currentProperty={store.currentProperty}
                                properties={store.properties}
                                isFetching={store.isFetching}
                                onSelectProperty={handlePropertySelect}
                                onSelectUnit={handleUnitSelect}
                                selectedUnit={unit}
                                label={t('Add new reservation')}
                                onAddReservationClick={() => navigate('/calendar')}
                            />
                        </HStack>
                    ) : (
                        <Box display={{ base: 'block', lg: 'none' }}>
                            <IconButton
                                aria-label="Open menu"
                                colorScheme="blue"
                                onClick={onOpen}
                                icon={<CgMenuRightAlt />}
                            />

                            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                                <DrawerOverlay>
                                    <DrawerContent>
                                        <DrawerCloseButton />
                                        <DrawerBody>
                                            <VStack alignItems="flex-start" py={10}>
                                                <ReservationActions
                                                    currentProperty={store.currentProperty}
                                                    properties={store.properties}
                                                    isFetching={store.isFetching}
                                                    onSelectProperty={handlePropertySelect}
                                                    onSelectUnit={handleUnitSelect}
                                                    selectedUnit={unit}
                                                    autocompleteWidth="full"
                                                    hasDivider={true}
                                                    label={t('Add new reservation')}
                                                    onAddReservationClick={() =>
                                                        navigate('/calendar')
                                                    }
                                                />
                                            </VStack>
                                        </DrawerBody>
                                    </DrawerContent>
                                </DrawerOverlay>
                            </Drawer>
                        </Box>
                    )}
                </>
            </HStack>
            <Divider my={4} />
            {renderReservations()}
        </motion.div>
    );
};

export default observer(Reservations);
