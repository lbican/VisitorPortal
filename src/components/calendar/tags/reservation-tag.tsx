import React from 'react';
import {
    Tag,
    TagLabel,
    TagLeftIcon,
    TagRightIcon,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { ThemeTypings } from '@chakra-ui/styled-system';
import { TbBrandAirbnb, TbBrandBooking } from 'react-icons/tb';
import { BiBookOpen } from 'react-icons/bi';
import { motion, Variants } from 'framer-motion';
import { IoPeopleOutline } from 'react-icons/io5';
import { ReservationType } from '../../../utils/interfaces/typings';
import { IconType } from 'react-icons';

interface ReservationTagProps {
    first_name: string;
    last_name: string;
    guests_num: number;
    isFirstDay: boolean;
    isLastDay: boolean;
    colorScheme: ThemeTypings['colorSchemes'];
    type: ReservationType;
    variants?: Variants;
}

const MotionTag = motion(Tag);

const getInitials = (first_name: string, last_name: string) => {
    return `${first_name[0]}. ${last_name[0]}.`;
};

interface TagScheme {
    icon: IconType;
    colorScheme: ThemeTypings['colorSchemes'];
}

const getIconAndScheme = (type: ReservationType): TagScheme => {
    switch (type) {
        case ReservationType.CUSTOM:
            return {
                icon: BiBookOpen,
                colorScheme: 'green',
            };
        case ReservationType.BOOKING:
            return {
                icon: TbBrandBooking,
                colorScheme: 'facebook',
            };
        case ReservationType.AIRBNB:
            return {
                icon: TbBrandAirbnb,
                colorScheme: 'red',
            };
    }
};

const ReservationTag: React.FC<ReservationTagProps> = ({
    first_name,
    last_name,
    guests_num,
    isFirstDay,
    isLastDay,
    type,
    variants,
}) => {
    const tagScheme = getIconAndScheme(type);
    const isSmallScreen = useBreakpointValue({ base: true, lg: false });
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
            colorScheme={tagScheme.colorScheme}
            w="full"
            zIndex={-1}
            marginLeft={isFirstDay ? 8 : 0}
            marginRight={isLastDay ? 4 : 0}
            roundedLeft={isFirstDay ? 6 : 0}
            roundedRight={isLastDay ? 6 : 0}
            variants={variants}
        >
            <TagLeftIcon as={tagScheme.icon} display={{ base: 'none', md: 'block' }} />
            <TagLabel as="p">
                <Text as="span" fontSize={isSmallScreen ? 10 : 'unset'}>
                    {isNameVisible() && name}
                </Text>
                <Text as="b" display={{ base: 'none', lg: 'inline-block' }}>
                    {guests_num}
                </Text>
            </TagLabel>
            <TagRightIcon display={{ base: 'none', lg: 'block' }} as={IoPeopleOutline} />
        </MotionTag>
    );
};

export default React.memo(ReservationTag);
