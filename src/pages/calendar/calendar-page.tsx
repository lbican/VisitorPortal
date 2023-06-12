import React, { ReactElement, useEffect, useState } from 'react';
import {
    Divider,
    Heading,
    HStack,
    Tag,
    TagLeftIcon,
    useDisclosure,
    TagLabel,
    Flex,
    Image,
    Alert,
    AlertIcon,
    Skeleton,
    IconButton,
    Tooltip,
} from '@chakra-ui/react';
import Calendar from 'react-calendar';
import '../../styles/calendar.scss';
import { isBefore, isWithinInterval } from 'date-fns';
import EmptyCalendarImage from '../../assets/images/empty_cal.svg';
import { View, Value } from 'react-calendar/dist/cjs/shared/types';
import { useAuth } from '../../context/auth-context';
import { IProperty, IUnit } from '../../utils/interfaces/typings';
import { propertyStore, propertyStore as store } from '../../mobx/propertyStore';
import Autocomplete, {
    ILabel,
    mapToAutocompleteLabels,
    mapValueToLabel,
} from '../../components/common/input/autocomplete';
import { observer } from 'mobx-react-lite';
import { SingleValue } from 'react-select';
import { IoPricetag, IoPricetagOutline } from 'react-icons/io5';
import { CalendarService, IDatePrice } from '../../services/calendar-service';
import PriceModal from './form/price-modal';
import PDFButton from '../../pdf/pdf-button';
import { isUndefined } from 'lodash';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

interface ITileProps {
    view: View;
    date: Date;
}

enum PriceStatus {
    SOLD = 'yellow',
    AVAILABLE = 'green',
    UNSET = 'gray',
}

interface PriceTagProps {
    status: PriceStatus;
    price?: number;
    loading?: boolean;
}

const PriceTag: React.FC<PriceTagProps> = ({ price, status, loading }) => {
    return (
        <Flex justifyContent="flex-end" mb={-6} px={2}>
            <Skeleton isLoaded={!loading}>
                <Tag size="md" variant="solid" colorScheme={status} alignSelf="flex-end">
                    {status !== PriceStatus.UNSET && !isUndefined(price) ? (
                        <>
                            <TagLeftIcon as={IoPricetag} />
                            <TagLabel>{price} €</TagLabel>
                        </>
                    ) : (
                        <>
                            <TagLeftIcon as={IoPricetagOutline} />
                        </>
                    )}
                </Tag>
            </Skeleton>
        </Flex>
    );
};

const CalendarPage = (): ReactElement => {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [unit, setUnit] = useState<IUnit | null>(null);
    const [datePrices, setDatePrices] = useState<IDatePrice[]>([]);
    const [loadingPrices, setLoadingPrices] = useState(false);
    const { user } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { t } = useTranslation();

    useEffect(() => {
        void store.fetchProperties(user?.id);
    }, [store, user]);

    const fetchDatePrices = () => {
        if (unit) {
            setLoadingPrices(true);
            CalendarService.fetchDatePrices(unit.id)
                .then((datePrices) => {
                    setDatePrices(datePrices);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setLoadingPrices(false);
                });
        }
    };

    useEffect(() => {
        fetchDatePrices();
    }, [unit]);

    const handlePropertySelect = (newValue: SingleValue<ILabel>) => {
        newValue && store.getCurrentProperty(newValue.value);
        setUnit(null);
        setSelectedDates([]);
    };

    const handleUnitSelect = (newValue: SingleValue<ILabel>) => {
        setSelectedDates([]);
        setDatePrices([]);
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

    const getTilePrices = ({ date, view }: ITileProps) => {
        if (view === 'month' && loadingPrices) {
            return <PriceTag loading={loadingPrices} status={PriceStatus.AVAILABLE} />;
        }

        if (view === 'month') {
            for (const datePrice of datePrices) {
                if (
                    isWithinInterval(date, {
                        start: datePrice.date_range[0],
                        end: datePrice.date_range[1],
                    }) &&
                    isBefore(date, datePrice.date_range[1])
                ) {
                    return <PriceTag price={datePrice.price} status={PriceStatus.AVAILABLE} />;
                }
            }
        }

        return <PriceTag status={PriceStatus.UNSET} />;
    };

    return (
        <>
            <HStack justifyContent="space-between" mb={4}>
                <Heading as="h2" size="lg">
                    {t('Calendar')}
                </Heading>
                <HStack>
                    <Autocomplete
                        value={mapValueToLabel(store.currentProperty)}
                        onSelect={handlePropertySelect}
                        placeholder={t('Select property') ?? ''}
                        options={mapToAutocompleteLabels<IProperty>(store.properties)}
                        isLoading={store.isFetching}
                        width="14rem"
                    />
                    <Autocomplete
                        value={mapValueToLabel(unit)}
                        onSelect={handleUnitSelect}
                        placeholder={t('Select unit') ?? ''}
                        options={mapToAutocompleteLabels<IUnit>(store.currentProperty?.units ?? [])}
                        isDisabled={!store.currentProperty}
                        width="14rem"
                    />
                    <Tooltip
                        hasArrow
                        label={
                            datesSelected()
                                ? t('Assign price')
                                : t('Select date range to assign prices')
                        }
                    >
                        <IconButton
                            aria-label="Assign price"
                            colorScheme="green"
                            onClick={onOpen}
                            icon={<IoPricetag />}
                            isDisabled={!datesSelected()}
                        />
                    </Tooltip>
                    <PDFButton
                        property={propertyStore.currentProperty}
                        unit={unit}
                        datePrices={datePrices}
                    />
                </HStack>
            </HStack>
            <Divider mb={4} />
            {unit ? (
                <>
                    <PriceModal
                        isOpen={isOpen}
                        onClose={onClose}
                        unit={unit}
                        date_range={[selectedDates[0], selectedDates[1]]}
                        onValueSubmitted={() => fetchDatePrices()}
                    />
                    <Calendar
                        tileContent={getTilePrices}
                        locale={i18n.language ?? 'en'}
                        selectRange={true}
                        onChange={(value) => {
                            setSelectedDates(value as Date[]);
                        }}
                        value={selectedDates as Value}
                        minDetail="year"
                    />
                </>
            ) : (
                <>
                    <Alert status="info" mb={2} rounded={4}>
                        <AlertIcon />
                        {t('Please select property and unit to be able to edit calendar')}
                    </Alert>
                    <Image
                        src={EmptyCalendarImage}
                        alt="Empty calendar"
                        objectFit="contain"
                        w="full"
                        height="40rem"
                    />
                </>
            )}
        </>
    );
};

export default observer(CalendarPage);
