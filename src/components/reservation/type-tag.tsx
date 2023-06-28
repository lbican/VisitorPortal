import React from 'react';
import { IconType } from 'react-icons';
import { Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import { ReservationType } from '../../utils/interfaces/typings';
import { ThemeTypings } from '@chakra-ui/styled-system';
import { useTranslation } from 'react-i18next';

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

export default ReservationTag;
