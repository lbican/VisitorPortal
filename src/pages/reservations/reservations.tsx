import React, { ReactElement, useEffect, useState } from 'react';
import {
    Alert,
    AlertIcon,
    Button,
    Divider,
    Flex,
    Heading,
    HStack,
    Spinner,
    Stack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import DataTable from './table/data-table';
import { motion } from 'framer-motion';
import Autocomplete, {
    ILabel,
    mapToAutocompleteLabels,
    mapValueToLabel,
} from '../../components/common/input/autocomplete';
import { propertyStore as store } from '../../mobx/propertyStore';
import { IUnit } from '../../utils/interfaces/typings';
import { SingleValue } from 'chakra-react-select';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../../context/auth-context';
import { reservationStore } from '../../mobx/reservationStore';
import { IoBook } from 'react-icons/io5';
import TooltipIconButton from '../../components/common/tooltip-icon-button';
import { useNavigate } from 'react-router-dom';

const Reservations = (): ReactElement => {
    const { t } = useTranslation();
    const [unit, setUnit] = useState<IUnit | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        void store.fetchProperties(user?.id);
    }, [store, user]);

    useEffect(() => {
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
                <Stack direction={{ base: 'column', lg: 'row' }}>
                    <Autocomplete
                        value={mapValueToLabel(store.currentProperty)}
                        onSelect={handlePropertySelect}
                        placeholder={t('Select property') ?? ''}
                        options={mapToAutocompleteLabels(store.properties)}
                        isLoading={store.isFetching}
                        width="16rem"
                    />
                    <Autocomplete
                        value={mapValueToLabel(unit)}
                        onSelect={handleUnitSelect}
                        placeholder={t('Select unit') ?? ''}
                        options={mapToAutocompleteLabels(store.currentProperty?.units ?? [])}
                        isDisabled={!store.currentProperty}
                        width="14rem"
                    />
                    <TooltipIconButton
                        hasArrow={true}
                        placement="bottom-start"
                        label={t('Add new reservation')}
                        ariaLabel="Add reservation"
                        colorScheme="orange"
                        onClick={() => navigate('/calendar')}
                        icon={<IoBook />}
                    />
                </Stack>
            </HStack>
            <Divider my={4} />
            {renderReservations()}
        </motion.div>
    );
};

export default observer(Reservations);
