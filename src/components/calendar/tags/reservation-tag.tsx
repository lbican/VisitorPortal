import React from 'react';
import {
    Box,
    useBreakpointValue,
    Tag,
    TagLabel,
    TagLeftIcon,
    Text,
    TagRightIcon,
} from '@chakra-ui/react';
import { ThemeTypings } from '@chakra-ui/styled-system';
import { TbBrandBooking } from 'react-icons/tb';
import { BiBookOpen } from 'react-icons/bi';
import { observer } from 'mobx-react-lite';
import { motion, Variants } from 'framer-motion';
import { IoPeopleOutline } from 'react-icons/io5';

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

const getInitials = (first_name: string, last_name: string) => {
    return `${first_name[0]}. ${last_name[0]}.`;
};

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
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const name = isSmallScreen
        ? getInitials(first_name, last_name)
        : `${first_name} ${last_name} | `;

    const isNameVisible = (): boolean => {
        if (isFirstDay) {
            return !isSmallScreen;
        }

        return true;
    };

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
            <TagLeftIcon
                as={isBookingReservation ? TbBrandBooking : BiBookOpen}
                display={{ base: 'none', md: 'block' }}
            />
            <TagLabel as="p">
                <Box as="span">{isNameVisible() && name}</Box>
                <Text as="b" display={{ base: 'none', md: 'inline-block' }}>
                    {guests_num}
                </Text>
            </TagLabel>
            <TagRightIcon display={{ base: 'none', lg: 'block' }} as={IoPeopleOutline} />
        </MotionTag>
    );
};

export default observer(ReservationTag);
