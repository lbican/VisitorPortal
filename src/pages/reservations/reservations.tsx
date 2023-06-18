import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Alert, AlertIcon, Divider, Heading, HStack, Spinner } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { DataTable } from './table/data-table';
import Autocomplete, {
    ILabel,
    mapToAutocompleteLabels,
    mapValueToLabel,
} from '../../components/common/input/autocomplete';
import { propertyStore as store } from '../../mobx/propertyStore';
import { IUnit, IReservation } from '../../utils/interfaces/typings';
import { SingleValue } from 'react-select';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../../context/auth-context';
import { ReservationService } from '../../services/reservation-service';

const Reservations = (): ReactElement => {
    const { t } = useTranslation();
    const [unit, setUnit] = useState<IUnit | null>(null);
    const [reservations, setReservations] = useState<IReservation[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>(
        'idle'
    );
    const { user } = useAuth();

    useEffect(() => {
        void store.fetchProperties(user?.id);
    }, [store, user]);

    useEffect(() => {
        fetchReservations();
    }, [unit]);

    const handlePropertySelect = (newValue: SingleValue<ILabel>) => {
        newValue && store.getCurrentProperty(newValue.value);
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

    const fetchReservations = useCallback(() => {
        if (unit) {
            setStatus('loading');
            ReservationService.fetchReservations(unit?.id)
                .then((res) => {
                    setReservations(res);
                    setStatus('succeeded');
                })
                .catch((error) => {
                    console.error(error);
                    setStatus('failed');
                });
        }
    }, [unit]);

    const renderReservations = () => {
        if (status === 'loading') {
            return <Spinner />;
        }

        if (status === 'failed') {
            return (
                <Alert status="error">
                    <AlertIcon />
                    {t('Error loading reservations')}
                </Alert>
            );
        }

        if (reservations.length === 0) {
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

        return <DataTable data={reservations} />;
    };

    return (
        <>
            <HStack justifyContent="space-between" mb={4}>
                <Heading as="h2" size="lg">
                    {t('Reservations')}
                </Heading>
                <HStack>
                    <Autocomplete
                        value={mapValueToLabel(store.currentProperty)}
                        onSelect={handlePropertySelect}
                        placeholder={t('Select property') ?? ''}
                        options={mapToAutocompleteLabels(store.properties)}
                        isLoading={store.isFetching}
                        width="14rem"
                    />
                    <Autocomplete
                        value={mapValueToLabel(unit)}
                        onSelect={handleUnitSelect}
                        placeholder={t('Select unit') ?? ''}
                        options={mapToAutocompleteLabels(
                            store.currentProperty?.units ?? []
                        )}
                        isDisabled={!store.currentProperty}
                        width="14rem"
                    />
                </HStack>
            </HStack>
            <Divider my={4} />
            {renderReservations()}
        </>
    );
};

export default observer(Reservations);
