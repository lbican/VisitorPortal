import React, { ReactElement, useEffect, useState } from 'react';
import { Divider, Heading, HStack, Stack, useDisclosure } from '@chakra-ui/react';
import '../../styles/calendar.scss';
import { useAuth } from '../../context/auth-context';
import { IProperty, IUnit } from '../../utils/interfaces/typings';
import { propertyStore as store } from '../../mobx/propertyStore';
import Autocomplete, {
    ILabel,
    mapToAutocompleteLabels,
    mapValueToLabel,
} from '../../components/common/input/autocomplete';
import { observer } from 'mobx-react-lite';
import { SingleValue } from 'chakra-react-select';
import { IoPricetag, IoBook } from 'react-icons/io5';
import PriceModal from './form/price-modal';
import PDFButton from '../../pdf/pdf-button';
import { useTranslation } from 'react-i18next';
import ReservationModal from '../reservations/form/reservation-action-modal';
import { InfoDisplay } from '../../components/calendar/info-display';
import TooltipIconButton from '../../components/common/tooltip-icon-button';
import { reservationStore } from '../../mobx/reservationStore';
import { AnimatePresence, motion } from 'framer-motion';
import ReservationCalendar from '../../components/calendar/reservation-calendar';

export enum PriceStatus {
    SOLD = 'yellow',
    LOADING = 'teal',
    AVAILABLE = 'green',
    UNSET = 'gray',
}

const CalendarPage = (): ReactElement => {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [unit, setUnit] = useState<IUnit | null>(null);
    const { user } = useAuth();
    const {
        isOpen: isPriceModalOpen,
        onOpen: onPriceModalOpen,
        onClose: onPriceModalClose,
    } = useDisclosure();
    const {
        isOpen: isReservationModalOpen,
        onOpen: onReservationModalOpen,
        onClose: onReservationModalClose,
    } = useDisclosure();
    const { t } = useTranslation();

    useEffect(() => {
        void store.fetchProperties(user?.id);
    }, [store, user]);

    useEffect(() => {
        reservationStore.fetchDatePrices(unit?.id);
        reservationStore.fetchUnitReservations(unit?.id);
    }, [unit]);

    const handlePropertySelect = (newValue: SingleValue<ILabel>) => {
        newValue && store.getCurrentProperty(newValue.value);
        setUnit(null);
        setSelectedDates([]);
    };

    const handleUnitSelect = (newValue: SingleValue<ILabel>) => {
        if (newValue?.value === unit?.id) {
            return;
        }

        setSelectedDates([]);
        reservationStore.setUnitPrices([]);
        reservationStore.setReservations([]);
        reservationStore.setIsFetchingPrices(true);
        if (!store.currentProperty?.units || !newValue) {
            return null;
        }

        const unitIndex = store.currentProperty.units.findIndex((unit) => {
            return unit.id == newValue.value;
        });

        if (unitIndex > -1) {
            setUnit(store.currentProperty.units[unitIndex]);
        }
    };

    const datesSelected = (): boolean => {
        return !!(selectedDates[0] && selectedDates[1]);
    };

    return (
        <motion.div
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <HStack justifyContent="space-between" mb={4}>
                <Heading as="h2" size="lg">
                    {t('Calendar')}
                </Heading>
                <Stack direction={{ base: 'column', lg: 'row' }}>
                    <Autocomplete
                        value={mapValueToLabel(store.currentProperty)}
                        onSelect={handlePropertySelect}
                        placeholder={t('Select property') ?? ''}
                        options={mapToAutocompleteLabels<IProperty>(store.properties)}
                        isLoading={store.isFetching}
                        width="16rem"
                    />
                    <Autocomplete
                        value={mapValueToLabel(unit)}
                        onSelect={handleUnitSelect}
                        placeholder={t('Select unit') ?? ''}
                        options={mapToAutocompleteLabels<IUnit>(store.currentProperty?.units ?? [])}
                        isDisabled={!store.currentProperty}
                        width="14rem"
                    />
                    <HStack>
                        <TooltipIconButton
                            hasArrow={true}
                            label={
                                datesSelected()
                                    ? t('Assign price')
                                    : t('Select date range to assign prices')
                            }
                            ariaLabel="Assign price"
                            colorScheme="green"
                            onClick={onPriceModalOpen}
                            icon={<IoPricetag />}
                            isDisabled={!datesSelected()}
                            placement="bottom-start"
                        />
                        <TooltipIconButton
                            hasArrow={true}
                            placement="bottom-start"
                            label={
                                datesSelected()
                                    ? t('Add new reservation')
                                    : t('Select date range to add reservation')
                            }
                            ariaLabel="Add reservation"
                            colorScheme="orange"
                            onClick={onReservationModalOpen}
                            icon={<IoBook />}
                            isDisabled={!datesSelected()}
                        />

                        <PDFButton
                            property={store.currentProperty}
                            unit={unit}
                            datePrices={reservationStore.unitPrices}
                        />
                    </HStack>
                </Stack>
            </HStack>
            <Divider mb={4} />
            {unit ? (
                <>
                    {datesSelected() && (
                        <>
                            <PriceModal
                                isOpen={isPriceModalOpen}
                                onClose={onPriceModalClose}
                                unit={unit}
                                date_range={[selectedDates[0], selectedDates[1]]}
                            />
                            <ReservationModal
                                isOpen={isReservationModalOpen}
                                onClose={onReservationModalClose}
                                unit={unit}
                                date_range={[selectedDates[0], selectedDates[1]]}
                            />
                        </>
                    )}
                    <AnimatePresence>
                        <ReservationCalendar
                            onChange={(value) => setSelectedDates(value as Date[])}
                            selectedDates={selectedDates}
                            reservations={reservationStore.reservations}
                            prices={reservationStore.unitPrices}
                            isFetchingData={reservationStore.isFetchingData}
                        />
                    </AnimatePresence>
                </>
            ) : (
                <InfoDisplay />
            )}
        </motion.div>
    );
};

export default observer(CalendarPage);
