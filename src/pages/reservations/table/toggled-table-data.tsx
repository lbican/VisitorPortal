import * as React from 'react';
import { Alert, AlertIcon, Tag, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { addDays } from 'date-fns/fp';
import { Row } from '@tanstack/react-table';
import { IReservation } from '../../../utils/interfaces/typings';
interface SubComponentProps {
    row: Row<IReservation>;
}

const ToggledTableData: React.FC<SubComponentProps> = ({ row }) => {
    const { ...reservation } = row.original;
    useColorModeValue('whitesmoke', 'gray.800');
    const { t } = useTranslation();
    const prepaymentAmount = (reservation.prepayment_percent / 100) * reservation.total_price;

    return (
        <VStack alignItems="flex-start">
            <Text>
                {t('arrivalDate', {
                    arrivalDate: reservation.date_range[0].toLocaleDateString(
                        i18n.language ?? 'en'
                    ),
                })}
            </Text>
            <Text>
                {t('departureDate', {
                    departureDate: addDays(1, reservation.date_range[1]).toLocaleDateString(
                        i18n.language ?? 'en'
                    ),
                })}
            </Text>
            {!reservation.prepayment_paid && (
                <Text>
                    {t('Advance payment amount:')}
                    <Text as="b"> {prepaymentAmount}€</Text>
                    <Tag ml={2} colorScheme="orange">
                        {t('PENDING')}
                    </Tag>
                </Text>
            )}
            {reservation.note && (
                <>
                    <Text as="b">{t('Note')}</Text>
                    <Alert status="info" variant="left-accent" maxW="xl" rounded={4}>
                        <AlertIcon />
                        {reservation.note}
                    </Alert>
                </>
            )}
        </VStack>
    );
};

export default ToggledTableData;
