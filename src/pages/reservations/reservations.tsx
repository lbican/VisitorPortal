import React, { ReactElement } from 'react';
import { Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const Reservations = (): ReactElement => {
    const { t } = useTranslation();
    return (
        <Heading as="h2" size="lg">
            {t('Reservations')}
        </Heading>
    );
};

export default Reservations;
