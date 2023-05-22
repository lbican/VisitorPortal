import React, { ReactElement, useState } from 'react';
import { Heading, HStack, Text } from '@chakra-ui/react';
import Calendar from 'react-calendar';
import '../../styles/calendar.scss';
import { isWithinInterval } from 'date-fns';
import { View, Value } from 'react-calendar/dist/cjs/shared/types';
import OptionSelector from '../../components/common/option-selector';

interface ITileProps {
    view: View;
    date: Date;
}

const CalendarPage = (): ReactElement => {
    const [date, onChange] = useState<Date[]>([]);

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
                <HStack spacing={2}>
                    <OptionSelector
                        options={['Option One', 'Option Two', 'Option Three']}
                        defaultOption="Select Option"
                        onSelect={(selectedOption: string) => console.log(selectedOption)}
                    />
                    <OptionSelector
                        options={['Unit one', 'Unit two']}
                        defaultOption="Select Unit"
                        onSelect={(selectedOption: string) => console.log(selectedOption)}
                    />
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
