import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import i18n from 'i18next';
import { Value, View } from 'react-calendar/dist/cjs/shared/types';
import Calendar from 'react-calendar';
import { IReservation } from '../../utils/interfaces/typings';
import { IDatePrice } from '../../services/calendar-service';
import { format, isBefore, isWithinInterval, subDays } from 'date-fns';
import ReservationTag from './tags/reservation-tag';
import { addDays, isSameDay } from 'date-fns/fp';
import PriceTag from './tags/price-tag';
import { PriceStatus } from '../../pages/calendar/calendar-page';
import '../../styles/calendar.scss';

interface ReservationCalendarProps {
    onChange: (value: Value) => void;
    selectedDates: Date[];
    reservations: IReservation[];
    prices: IDatePrice[];
    isFetchingData: boolean;
}

type ComponentLookup = Record<string, ReactElement | null>;
const dateToKey = (date: Date) => format(date, 'yyyyMMdd');

const isWithinDateRange = (date: Date, date_range: [Date, Date]) =>
    isWithinInterval(date, {
        start: date_range[0],
        end: date_range[1],
    }) && isBefore(date, date_range[1]);

const getCalendarAnimations = (fromTop: boolean) => {
    return {
        hidden: { opacity: 0, y: fromTop ? -10 : 10 },
        show: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
    };
};

interface ITileProps {
    view: View;
    date: Date;
}

export const ReservationCalendar: React.FC<ReservationCalendarProps> = ({
    onChange,
    selectedDates,
    reservations,
    prices,
    isFetchingData,
}) => {
    const [reservationLookup, setReservationLookup] = useState<ComponentLookup>({});
    const [priceLookup, setPriceLookup] = useState<ComponentLookup>({});

    const updateLookups = useCallback(() => {
        const reservationLookup: ComponentLookup = {};
        const priceLookup: ComponentLookup = {};

        reservations.forEach((reservation) => {
            const { date_range, guest } = reservation;
            let day = new Date(date_range[0]);

            while (isWithinDateRange(day, date_range)) {
                const dateString = dateToKey(day);

                reservationLookup[dateString] = (
                    <ReservationTag
                        colorScheme="blue"
                        first_name={guest.first_name}
                        last_name={guest.last_name}
                        guests_num={guest.guests_num}
                        isFirstDay={isSameDay(day, date_range[0])}
                        isLastDay={isSameDay(day, subDays(date_range[1], 1))}
                        type={reservation.type}
                        variants={getCalendarAnimations(false)}
                    />
                );

                day = addDays(1, day);
            }
        });

        prices.forEach((priceInfo) => {
            const { date_range, price } = priceInfo;
            let day = new Date(date_range[0]);

            while (isWithinDateRange(day, date_range)) {
                const dateString = dateToKey(day);
                const soldDate = reservationLookup[dateString] !== undefined;

                priceLookup[dateString] = (
                    <PriceTag
                        price={price}
                        status={soldDate ? PriceStatus.SOLD : PriceStatus.AVAILABLE}
                        variants={getCalendarAnimations(true)}
                    />
                );

                day = addDays(1, day);
            }
        });

        setReservationLookup(reservationLookup);
        setPriceLookup(priceLookup);
    }, [reservations, prices]);

    useEffect(() => {
        updateLookups();
    }, [reservations, prices]);

    const getTileContent = useCallback(
        ({ date, view }: ITileProps) => {
            if (view !== 'month') return;

            if (isFetchingData) {
                return <PriceTag loading={true} status={PriceStatus.LOADING} />;
            }

            const formattedDate = dateToKey(date);

            const reservationElement = reservationLookup[formattedDate];
            const priceTagElement = priceLookup[formattedDate];

            if (!priceTagElement && !reservationElement) {
                return <PriceTag status={PriceStatus.UNSET} />;
            }

            return (
                <>
                    {reservationElement}
                    {priceTagElement}
                </>
            );
        },
        [reservationLookup, priceLookup, isFetchingData]
    );

    return (
        <Calendar
            tileContent={getTileContent}
            locale={i18n.language ?? 'en'}
            selectRange={true}
            onChange={onChange}
            value={selectedDates as Value}
            minDetail="year"
        />
    );
};

export default ReservationCalendar;
