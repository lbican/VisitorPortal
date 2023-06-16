import React from 'react';
import { Tag, TagLabel, TagLeftIcon, Text } from '@chakra-ui/react';
import { ThemeTypings } from '@chakra-ui/styled-system';
import { TbBrandBooking } from 'react-icons/tb';
import { BiBookOpen } from 'react-icons/bi';

interface ReservationTagProps {
    first_name: string;
    last_name: string;
    guests_num: number;
    isFirstDay: boolean;
    isLastDay: boolean;
    colorScheme: ThemeTypings['colorSchemes'];
    isBookingReservation: boolean;
}

const ReservationTag: React.FC<ReservationTagProps> = ({
    first_name,
    last_name,
    guests_num,
    isFirstDay,
    isLastDay,
    colorScheme,
    isBookingReservation,
}) => {
    return (
        <Tag
            size="md"
            variant="solid"
            colorScheme={colorScheme}
            w="full"
            zIndex={-1}
            marginLeft={isFirstDay ? 8 : 0}
            marginRight={isLastDay ? 4 : 0}
            roundedLeft={isFirstDay ? 6 : 0}
            roundedRight={isLastDay ? 6 : 0}
        >
            <TagLeftIcon as={isBookingReservation ? TbBrandBooking : BiBookOpen} />
            <TagLabel as="p">
                {first_name} {last_name} | <Text as="b">{guests_num}</Text>
            </TagLabel>
        </Tag>
    );
};

export default ReservationTag;
