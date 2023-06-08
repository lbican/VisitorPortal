import React, { ReactElement, useEffect, useState } from 'react';
import {
    Divider,
    Heading,
    HStack,
    Tag,
    TagLabel,
    Text,
    TagRightIcon,
    Flex,
    Button,
    Image,
    useDisclosure,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import Calendar from 'react-calendar';
import '../../styles/calendar.scss';
import { isBefore, isWithinInterval } from 'date-fns';
import EmptyCalendarImage from '../../assets/empty_calendar.svg';
import { View, Value } from 'react-calendar/dist/cjs/shared/types';
import { useAuth } from '../../context/auth-context';
import { IProperty, IUnit } from '../../utils/interfaces/typings';
import { propertyStore as store } from '../../mobx/propertyStore';
import Autocomplete, {
    ILabel,
    mapToAutocompleteLabel,
    mapValueToLabel,
} from '../../components/common/input/autocomplete';
import { observer } from 'mobx-react-lite';
import { SingleValue } from 'react-select';
import { IoLogoEuro, IoMdPricetag } from 'react-icons/io';
import { CalendarService, IDatePrice } from '../../services/calendar-service';
import PriceModal from './form/price-modal';

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
}

const PriceTag: React.FC<PriceTagProps> = ({ price, status }) => {
    return (
        <Flex justifyContent="flex-end" mb={-6} px={2}>
            <Tag size="md" variant="solid" colorScheme={status} alignSelf="flex-end">
                <TagLabel>{price ?? 'Unset'}</TagLabel>
                {status !== PriceStatus.UNSET && <TagRightIcon boxSize="12px" as={IoLogoEuro} />}
            </Tag>
        </Flex>
    );
};

const CalendarPage = (): ReactElement => {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [unit, setUnit] = useState<IUnit | null>(null);
    const [refresh, setRefresh] = useState(false);
    const [datePrices, setDatePrices] = useState<IDatePrice[]>([]);
    const [loadingPrices, setLoadingPrices] = useState(false);
    const { user } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        void store.fetchProperties(user?.id);
    }, [store, user]);

    useEffect(() => {
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
    }, [unit, refresh]);

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

    const getTilePrices = ({ date, view }: ITileProps) => {
        if (view === 'month' && loadingPrices) {
            return <PriceTag price={0} status={PriceStatus.AVAILABLE} />;
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
                    Calendar
                </Heading>
                <HStack>
                    <Autocomplete
                        value={mapValueToLabel(store.currentProperty)}
                        onSelect={handlePropertySelect}
                        placeholder="Select property"
                        options={mapToAutocompleteLabel<IProperty>(store.properties)}
                        isLoading={store.isFetching}
                        width="14rem"
                    />
                    <Autocomplete
                        value={mapValueToLabel(unit)}
                        onSelect={handleUnitSelect}
                        placeholder="Select unit"
                        options={mapToAutocompleteLabel<IUnit>(store.currentProperty?.units ?? [])}
                        isDisabled={!store.currentProperty}
                        width="14rem"
                    />
                    <Button
                        colorScheme="green"
                        onClick={onOpen}
                        leftIcon={<IoMdPricetag />}
                        isDisabled={!selectedDates[0] || !selectedDates[1]}
                    >
                        Assign price
                    </Button>
                </HStack>
            </HStack>
            <Divider mb={4} />
            {unit ? (
                <Calendar
                    tileContent={getTilePrices}
                    locale="en"
                    selectRange={true}
                    onChange={(value) => {
                        setSelectedDates(value as Date[]);
                    }}
                    value={selectedDates as Value}
                    minDetail="year"
                />
            ) : (
                <>
                    <Alert status="info" mb={2}>
                        <AlertIcon />
                        Please select property and unit to be able to edit calendar
                    </Alert>
                    <Image
                        src={EmptyCalendarImage}
                        alt="Empty calendar"
                        objectFit="cover"
                        w="full"
                        height="40rem"
                    />
                </>
            )}
            {unit && (
                <PriceModal
                    isOpen={isOpen}
                    onClose={onClose}
                    unit={unit}
                    date_range={[selectedDates[0], selectedDates[1]]}
                    onValueSubmitted={() => {
                        setRefresh(!refresh);
                    }}
                />
            )}
            {selectedDates.length > 0 && (
                <Text as="p">
                    <Text as="b">Start:</Text> {selectedDates[0].toDateString()}|
                    <Text as="b">End:</Text> {selectedDates[1].toDateString()}
                </Text>
            )}
        </>
    );
};

export default observer(CalendarPage);
