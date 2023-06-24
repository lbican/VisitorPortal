import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import {
    Divider,
    Heading,
    HStack,
    SimpleGrid,
    Stack,
    useDisclosure,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import Calendar from 'react-calendar';
import '../../styles/calendar.scss';
import { isBefore, isWithinInterval, subDays } from 'date-fns';
import { View, Value } from 'react-calendar/dist/cjs/shared/types';
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
import i18n from 'i18next';
import ReservationModal from '../reservations/form/reservation-action-modal';
import { InfoDisplay } from '../../components/calendar/info-display';
import { isSameDay } from 'date-fns/fp';
import PriceTag from '../../components/calendar/tags/price-tag';
import ReservationTag from '../../components/calendar/tags/reservation-tag';
import TooltipIconButton from '../../components/common/tooltip-icon-button';
import { reservationStore } from '../../mobx/reservationStore';
import { AnimatePresence, motion } from 'framer-motion';

interface ITileProps {
    view: View;
    date: Date;
}

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

    const getCalendarAnimations = (fromTop: boolean) => {
        return {
            hidden: { opacity: 0, y: fromTop ? -10 : 10 },
            show: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 10 },
        };
    };

    const isWithinDateRange = (date: Date, date_range: [Date, Date]) =>
        isWithinInterval(date, {
            start: date_range[0],
            end: date_range[1],
        }) && isBefore(date, date_range[1]);

    const getTileContent = useCallback(
        ({ date, view }: ITileProps) => {
            if (view !== 'month') return;
            let priceTagElement: ReactElement | null = null;
            let reservationElement: ReactElement | null = null;
            let soldDate = false;

            if (reservationStore.isFetchingData) {
                return <PriceTag loading={true} status={PriceStatus.LOADING} />;
            }

            for (const reservation of reservationStore.reservations) {
                const [startDate, endDate] = reservation.date_range;
                const lastDay = subDays(endDate, 1);

                if (isWithinDateRange(date, [startDate, endDate])) {
                    const { first_name, last_name, guests_num } = reservation.guest;

                    reservationElement = (
                        <ReservationTag
                            colorScheme={reservation.is_booking_reservation ? 'blue' : 'teal'}
                            first_name={first_name}
                            last_name={last_name}
                            guests_num={guests_num}
                            isFirstDay={isSameDay(date, startDate)}
                            isLastDay={isSameDay(date, lastDay)}
                            isBookingReservation={reservation.is_booking_reservation}
                            variants={getCalendarAnimations(true)}
                        />
                    );

                    soldDate = true;
                    break;
                }
            }

            for (const datePrice of reservationStore.unitPrices) {
                if (isWithinDateRange(date, datePrice.date_range)) {
                    priceTagElement = (
                        <PriceTag
                            price={datePrice.price}
                            status={soldDate ? PriceStatus.SOLD : PriceStatus.AVAILABLE}
                            variants={getCalendarAnimations(false)}
                        />
                    );
                    break;
                }
            }

            if (!priceTagElement && !reservationElement) {
                priceTagElement = <PriceTag status={PriceStatus.UNSET} />;
            }

            return (
                <>
                    {reservationElement}
                    {priceTagElement}
                </>
            );
        },
        [reservationStore.reservations, reservationStore.unitPrices]
    );
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
                        <Calendar
                            tileContent={getTileContent}
                            locale={i18n.language ?? 'en'}
                            selectRange={true}
                            onChange={(value) => {
                                setSelectedDates(value as Date[]);
                            }}
                            value={selectedDates as Value}
                            minDetail="year"
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
