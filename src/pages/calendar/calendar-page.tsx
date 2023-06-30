import React, { ReactElement, useEffect, useState } from 'react';
import {
    Box,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    Heading,
    HStack,
    IconButton,
    Text,
    useBreakpointValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import '../../styles/calendar.scss';
import { useAuth } from '../../context/auth-context';
import { IUnit } from '../../utils/interfaces/typings';
import { propertyStore as store } from '../../mobx/propertyStore';
import { ILabel } from '../../components/common/input/autocomplete';
import { observer } from 'mobx-react-lite';
import { SingleValue } from 'chakra-react-select';
import PriceModal from './form/price-modal';
import { useTranslation } from 'react-i18next';
import ReservationModal from '../reservations/form/reservation-action-modal';
import { InfoDisplay } from '../../components/calendar/info-display';
import { reservationStore } from '../../mobx/reservationStore';
import { AnimatePresence, motion } from 'framer-motion';
import ReservationCalendar from '../../components/calendar/reservation-calendar';
import CalendarActions from '../../components/common/action/calendar-header';
import { CgMenuRightAlt } from 'react-icons/cg';

export enum PriceStatus {
    SOLD = 'yellow',
    LOADING = 'teal',
    AVAILABLE = 'green',
    UNSET = 'gray',
}

interface LimitationsProps {
    hasDatesSelected: boolean;
    isCalendarVisible: boolean;
}

const Limitations: React.FC<LimitationsProps> = ({ hasDatesSelected, isCalendarVisible }) => {
    const { t } = useTranslation();
    if (hasDatesSelected && isCalendarVisible) {
        return <Text as="small">{t('No limitations')}</Text>;
    }

    return (
        <>
            {!isCalendarVisible && (
                <Text colorScheme="red">
                    {t('You need to select property and unit to be able to manage calendar')}
                </Text>
            )}
            {!hasDatesSelected && (
                <Text colorScheme="red">
                    {t('Dates need to be selected to assign prices and add reservations')}
                </Text>
            )}
        </>
    );
};

const CalendarPage = (): ReactElement => {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const isLargerScreen = useBreakpointValue({ base: false, lg: true });
    const [unit, setUnit] = useState<IUnit | null>(null);
    const { user } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
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
                <>
                    {isLargerScreen ? (
                        <HStack>
                            <HStack>
                                <CalendarActions
                                    currentProperty={store.currentProperty}
                                    properties={store.properties}
                                    onSelectProperty={handlePropertySelect}
                                    onSelectUnit={handleUnitSelect}
                                    onReservationModalOpen={onReservationModalOpen}
                                    onPriceModalOpen={onPriceModalOpen}
                                    datesSelected={datesSelected()}
                                    selectedUnit={unit}
                                    unitPrices={reservationStore.unitPrices}
                                    isFetching={store.isFetching}
                                />
                            </HStack>
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
                                                <CalendarActions
                                                    currentProperty={store.currentProperty}
                                                    properties={store.properties}
                                                    onSelectProperty={handlePropertySelect}
                                                    onSelectUnit={handleUnitSelect}
                                                    onReservationModalOpen={onReservationModalOpen}
                                                    onPriceModalOpen={onPriceModalOpen}
                                                    datesSelected={datesSelected()}
                                                    hasDivider={true}
                                                    autocompleteWidth="full"
                                                    selectedUnit={unit}
                                                    unitPrices={reservationStore.unitPrices}
                                                    isFetching={store.isFetching}
                                                    onCloseDrawer={onClose}
                                                />
                                                <Divider my={2} />
                                                <Text as="b">{t('Limitations')}</Text>
                                                <Limitations
                                                    hasDatesSelected={datesSelected()}
                                                    isCalendarVisible={!!unit}
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
