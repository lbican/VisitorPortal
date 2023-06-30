import React from 'react';
import { IconType } from 'react-icons';
import { Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import { ReservationType } from '../../utils/interfaces/typings';
import { ThemeTypings } from '@chakra-ui/styled-system';
import { useTranslation } from 'react-i18next';
import { TbBrandAirbnb, TbBrandBooking } from 'react-icons/tb';
import { BiBookOpen } from 'react-icons/bi';

interface ReservationTagProps {
    icon: IconType;
    colorScheme: ThemeTypings['colorSchemes'];
    label: ReservationType;
}
const ReservationTag: React.FC<ReservationTagProps> = ({ icon, colorScheme, label }) => {
    const { t } = useTranslation();

    return (
        <Tag colorScheme={colorScheme}>
            <TagLeftIcon as={icon} />
            <TagLabel>{t(label)}</TagLabel>
        </Tag>
    );
};

interface ReservationTypeTagProps {
    type: ReservationType;
}

const ReservationTypeTag: React.FC<ReservationTypeTagProps> = ({ type }) => {
    switch (type) {
        case ReservationType.AIRBNB:
            return <ReservationTag icon={TbBrandAirbnb} label={type} colorScheme="red" />;
        case ReservationType.BOOKING:
            return <ReservationTag icon={TbBrandBooking} label={type} colorScheme="facebook" />;
        case ReservationType.CUSTOM:
            return <ReservationTag icon={BiBookOpen} label={type} colorScheme="green" />;
    }
};

export default ReservationTypeTag;
