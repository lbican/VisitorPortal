import React, { ReactElement, useEffect, useState } from 'react';
import {
    Divider,
    Heading,
    HStack,
    Tag,
    TagLeftIcon,
    TagLabel,
    Text,
    TagRightIcon,
    Flex,
} from '@chakra-ui/react';
import Calendar from 'react-calendar';
import '../../styles/calendar.scss';
import { isWithinInterval } from 'date-fns';
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
import { BiEuro } from 'react-icons/all';

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
                {status !== PriceStatus.UNSET && <TagRightIcon boxSize="12px" as={BiEuro} />}
            </Tag>
        </Flex>
    );
};

const CalendarPage = (): ReactElement => {
    const [date, onChange] = useState<Date[]>([]);
    const [unit, setUnit] = useState<IUnit | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        void store.fetchProperties(user?.id);
    }, [store, user]);

    const handlePropertySelect = (newValue: SingleValue<ILabel>) => {
        newValue && store.getCurrentProperty(newValue.value);
        setUnit(null);
    };

    const handleUnitSelect = (newValue: SingleValue<ILabel>) => {
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

    const startDate = new Date(2023, 5, 10); // June 10, 2023
    const endDate = new Date(2023, 5, 20); // June 20, 2023

    const tileDisabled = ({ date, view }: ITileProps) => {
        return (
            view === 'month' && // Disable only date tiles and leave month and year navigation enabled
            isWithinInterval(date, { start: startDate, end: endDate })
        ); // Check if date is within interval
    };

    const datePrice = ({ date, view }: ITileProps) => {
        if (view === 'month' && isWithinInterval(date, { start: startDate, end: endDate })) {
            return <PriceTag price={30} status={PriceStatus.SOLD} />;
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
                        width="12rem"
                    />
                    <Autocomplete
                        value={mapValueToLabel(unit)}
                        onSelect={handleUnitSelect}
                        placeholder="Select unit"
                        options={mapToAutocompleteLabel<IUnit>(store.currentProperty?.units ?? [])}
                        isDisabled={!store.currentProperty}
                        width="12rem"
                    />
                </HStack>
            </HStack>
            <Divider mb={4} />
            <Calendar
                tileContent={datePrice}
                locale="en"
                tileDisabled={tileDisabled}
                selectRange={true}
                onChange={(value) => {
                    onChange(value as Date[]);
                }}
                value={date as Value}
                minDetail="year"
            />
            {date.length > 0 && (
                <Text as="p">
                    <Text as="b">Start:</Text> {date[0].toDateString()}|<Text as="b">End:</Text>{' '}
                    {date[1].toDateString()}
                </Text>
            )}
        </>
    );
};

export default observer(CalendarPage);
