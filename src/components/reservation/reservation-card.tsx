import { observer } from 'mobx-react-lite';
import { IReservation } from '../../utils/interfaces/typings';
import { HStack, Text, VStack, Flex, Tag } from '@chakra-ui/react';
import React from 'react';
import CardWrapper from './card/card-wrapper';
import i18n from 'i18next';
import { differenceInCalendarDays } from 'date-fns/fp';
import { differenceInDays, isWithinInterval } from 'date-fns';
import { BsMoonStars } from 'react-icons/bs';
import { IoPeopleOutline, IoPersonOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import ReservationTypeTag from './type-tag';

enum ReservationStatus {
    ARRIVAL,
    DEPARTURE,
}

const getReservationStatus = (date_range: [Date, Date]): ReservationStatus => {
    const today = new Date();
    const [startDate, endDate] = date_range;

    if (isWithinInterval(today, { start: startDate, end: endDate })) {
        return ReservationStatus.DEPARTURE;
    }

    return ReservationStatus.ARRIVAL;
};

const ReservationCard = (props: IReservation) => {
    const { first_name, last_name, guests_num } = props.guest;
    const { date_range } = props;
    const { t } = useTranslation();
    const nights = differenceInDays(date_range[1], date_range[0]);
    const daysUntilArrival = differenceInCalendarDays(new Date(), date_range[0]);
    const daysUntilDeparture = differenceInCalendarDays(new Date(), date_range[1]);

    const isArriving = getReservationStatus(date_range) === ReservationStatus.ARRIVAL;

    return (
        <CardWrapper isArriving={isArriving}>
            <Flex w="full" flexDirection={{ lg: 'row', base: 'column' }}>
                <VStack spacing={1} mb={3} textAlign="left" alignItems="flex-start" w="full">
                    <HStack wrap="wrap">
                        {isArriving ? (
                            <Text size="md">
                                <Text as="b" color="blue.500">
                                    {t('Checks in: ')}
                                </Text>
                                {t('onDate', {
                                    onDate: date_range[0].toLocaleDateString(i18n.language ?? 'en'),
                                })}
                                <Text as="span">{t('inDays', { inDays: daysUntilArrival })}</Text>
                            </Text>
                        ) : (
                            <Text size="md">
                                <Text as="b" color="red.500">
                                    {t('Checks out: ')}
                                </Text>
                                {t('onDate', {
                                    onDate: date_range[1].toLocaleDateString(i18n.language ?? 'en'),
                                })}
                                <Text as="span">{t('inDays', { inDays: daysUntilDeparture })}</Text>
                            </Text>
                        )}
                        <ReservationTypeTag type={props.type} />
                    </HStack>
                    <HStack alignItems="center" spacing={2} wrap="wrap">
                        <Text as="b">{nights}</Text>
                        <BsMoonStars />
                        <Text>|</Text>
                        <Text as="b">{guests_num}</Text>
                        <IoPeopleOutline />
                        <Text>|</Text>
                        <IoPersonOutline />
                        <Text as="b">
                            {first_name} {last_name}
                        </Text>
                        {!props.prepayment_paid && <Tag colorScheme="orange">{t('NOT PAID')}</Tag>}
                    </HStack>
                </VStack>
            </Flex>
        </CardWrapper>
    );
};

export default observer(ReservationCard);
