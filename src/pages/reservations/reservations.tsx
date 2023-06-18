import React, { ReactElement } from 'react';
import { Divider, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { DataTable } from './table/data-table';
import mockData from '../../utils/mocks/mock-data';

const Reservations = (): ReactElement => {
    const { t } = useTranslation();
    return (
        <>
            <Heading as="h2" size="lg">
                {t('Reservations')}
            </Heading>
            <Divider my={4} />
            <DataTable data={mockData} />
        </>
    );
};

export default Reservations;
