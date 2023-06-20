import React from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import { IReservation } from '../../../utils/interfaces/typings';
import ReservationCard from '../../reservation/reservation-card';
import { observer } from 'mobx-react-lite';
import LineWithDot from './line-with-dot';

interface TimelineProps {
    reservations: IReservation[];
    loadingTimeline: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ reservations, loadingTimeline }) => {
    if (loadingTimeline) {
        return (
            <Flex justifyContent="center" alignItems="center" height="50%">
                <Spinner size="lg" />
            </Flex>
        );
    }

    return (
        <Box maxWidth="4xl" p={2}>
            {reservations.length === 0 && <p>No reservations yet!</p>}
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
