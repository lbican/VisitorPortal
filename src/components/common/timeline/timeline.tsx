import React from 'react';
import { Alert, AlertIcon, Box, Flex, Spinner } from '@chakra-ui/react';
import { IReservation } from '../../../utils/interfaces/typings';
import ReservationCard from '../../reservation/reservation-card';
import { observer } from 'mobx-react-lite';
import LineWithDot from './line-with-dot';
import { useTranslation } from 'react-i18next';

interface TimelineProps {
    reservations: IReservation[];
    loadingTimeline: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ reservations, loadingTimeline }) => {
    const { t } = useTranslation();
    if (loadingTimeline) {
        return (
            <Flex justifyContent="center" alignItems="center" height="50%">
                <Spinner size="lg" />
            </Flex>
        );
    }

    return (
        <Box maxWidth="3xl" py={2}>
            {reservations.length === 0 && (
                <Alert status="warning" mb={2} rounded={4}>
                    <AlertIcon />
                    {t('No reservations found!')}
                </Alert>
            )}
            {reservations.map((reservation) => (
                <Flex key={reservation.id} mb="10px">
                    <LineWithDot />
                    <ReservationCard {...reservation} />
                </Flex>
            ))}
        </Box>
    );
};

export default observer(Timeline);
