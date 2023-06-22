import React from 'react';
import { Tag, TagLabel, TagLeftIcon, Text } from '@chakra-ui/react';
import { ThemeTypings } from '@chakra-ui/styled-system';
import { TbBrandBooking } from 'react-icons/tb';
import { BiBookOpen } from 'react-icons/bi';
import { observer } from 'mobx-react-lite';
import { motion, Variants } from 'framer-motion';

interface ReservationTagProps {
    first_name: string;
    last_name: string;
    guests_num: number;
    isFirstDay: boolean;
    isLastDay: boolean;
    colorScheme: ThemeTypings['colorSchemes'];
    isBookingReservation: boolean;
    variants?: Variants;
}

const MotionTag = motion(Tag);

const ReservationTag: React.FC<ReservationTagProps> = ({
    first_name,
    last_name,
    guests_num,
    isFirstDay,
    isLastDay,
    colorScheme,
    isBookingReservation,
    variants,
}) => {
    return (
        <MotionTag
            size="md"
            initial="hidden"
            animate="show"
            exit="exit"
            variant="solid"
            colorScheme={colorScheme}
            w="full"
            zIndex={-1}
            marginLeft={isFirstDay ? 8 : 0}
            marginRight={isLastDay ? 4 : 0}
            roundedLeft={isFirstDay ? 6 : 0}
            roundedRight={isLastDay ? 6 : 0}
            variants={variants}
        >
            <TagLeftIcon as={isBookingReservation ? TbBrandBooking : BiBookOpen} />
            <TagLabel as="p">
                {first_name} {last_name} | <Text as="b">{guests_num}</Text>
            </TagLabel>
        </MotionTag>
    );
};

export default observer(ReservationTag);
