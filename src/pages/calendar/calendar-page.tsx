import React, { ReactElement, useState } from 'react';
import { Heading, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import Calendar from 'react-calendar';
import '../../styles/calendar.scss';
import { isWithinInterval } from 'date-fns';
import { View, Value } from 'react-calendar/dist/cjs/shared/types';
import Select from 'react-select';
import useUserProperties from '../../hooks/useUserProperties';
import { useAuth } from '../../context/auth-context';
import { IProperty } from '../../utils/interfaces/typings';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

interface ILabel {
    value: string;
    label: string;
}

interface ITileProps {
    view: View;
    date: Date;
}

const mapPropertiesToLabels = (properties: IProperty[]): ILabel[] => {
    return properties.map((property) => {
        return {
            value: property.name,
            label: property.name,
        };
    });
};

const CalendarPage = (): ReactElement => {
    const [date, onChange] = useState<Date[]>([]);
    const { user } = useAuth();
    const { properties, error, isLoading } = useUserProperties(user?.id);

    const startDate = new Date(2023, 5, 10); // June 10, 2023
    const endDate = new Date(2023, 5, 20); // June 20, 2023

    const tileDisabled = ({ date, view }: ITileProps) => {
        return (
            view === 'month' && // Disable only date tiles and leave month and year navigation enabled
            isWithinInterval(date, { start: startDate, end: endDate })
        ); // Check if date is within interval
    };

    return (
        <>
            <HStack justifyContent="space-between" mb={4}>
                <Heading as="h2" size="lg">
                    Calendar
                </Heading>
                <HStack>
                    <Select
                        styles={{
                            menu: (provided) => ({
                                ...provided,
                                backgroundColor: useColorModeValue('white', 'gray'),
                            }),
                        }}
                        placeholder="Select property"
                        options={mapPropertiesToLabels(properties)}
                        isLoading={isLoading}
                    />
                    <Select placeholder="Select unit" options={options} />
                </HStack>
            </HStack>
            <Calendar
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

export default CalendarPage;
