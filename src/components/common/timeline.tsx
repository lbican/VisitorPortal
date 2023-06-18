import React from 'react';
import { Box, Text, Flex, useColorModeValue, Spinner } from '@chakra-ui/react';
import { IReservation } from '../../utils/interfaces/typings';
import ReservationCard from '../reservation/reservation-card';
import { observer } from 'mobx-react-lite';

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

const LineWithDot = () => {
    return (
        <Flex pos="relative" alignItems="center" mr="40px">
            <Text
                as="span"
                position="absolute"
                left="50%"
                height="calc(100% + 10px)"
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'blue.700')}
                top="0px"
            ></Text>
            <Box pos="relative" p="10px">
                <Box
                    pos="absolute"
                    width="100%"
                    height="100%"
                    bottom="0"
                    right="0"
                    top="0"
                    left="0"
                    backgroundSize="cover"
                    backgroundRepeat="no-repeat"
                    backgroundPosition="center center"
                    backgroundColor="rgb(255, 255, 255)"
                    borderRadius="100px"
                    border="3px solid #63B3ED"
                    backgroundImage="none"
                    opacity={1}
                ></Box>
            </Box>
        </Flex>
    );
};

export default observer(Timeline);
