import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { IReservation } from '../../../utils/interfaces/typings';
import { Button, HStack, Icon, IconButton } from '@chakra-ui/react';
import { GoTrashcan } from 'react-icons/go';
import i18n, { TFunction } from 'i18next';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';

const columnHelper = createColumnHelper<IReservation>();

const mapDateToLocaleString = (dates: [Date, Date]) => {
    const startDate = dates[0].toLocaleDateString(i18n.language ?? 'en');
    const endDate = dates[1].toLocaleDateString(i18n.language ?? 'en');

    return `${startDate} - ${endDate}`;
};

const getIcon = (isTruthy: boolean) => {
    if (isTruthy) {
        return <Icon as={AiFillCheckCircle} color="green.500" boxSize={8} />;
    }

    return <Icon as={AiFillCloseCircle} color="red.500" boxSize={8} />;
};

type HandleButtonClick = (reservation: IReservation) => void;
const columnHelpers = (
    t: TFunction,
    handleEditClick: HandleButtonClick,
    handleDeleteClick: HandleButtonClick
) => [
    columnHelper.accessor('guest.first_name', {
        header: t('First Name'),
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('guest.last_name', {
        header: t('Last Name'),
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('guest.guests_num', {
        header: t('Guests Number'),
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('is_booking_reservation', {
        header: t('Is Booking Reservation'),
        cell: (info) => getIcon(info.getValue()),
    }),
    columnHelper.accessor('date_range', {
        header: t('Date Range'),
        cell: (info) => mapDateToLocaleString(info.getValue()),
    }),
    columnHelper.accessor('total_price', {
        header: t('Total Price'),
        cell: (info) => `${info.getValue()} €`,
        meta: { isNumeric: true },
    }),
    columnHelper.accessor('fulfilled', {
        header: t('Fulfilled'),
        cell: (info) => getIcon(info.getValue()),
    }),
    columnHelper.accessor('prepayment_paid', {
        header: t('Advance Payment Paid'),
        cell: (info) => getIcon(info.getValue()),
    }),
    columnHelper.accessor('note', {
        header: t('Note'),
        cell: (info) => info.getValue(),
        enableSorting: false,
    }),
    columnHelper.display({
        id: 'actions',
        header: t('Actions'),
        cell: (info) => {
            return (
                <HStack>
                    <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => handleEditClick(info.row.original)}
                    >
                        {t('Edit')}
                    </Button>
                    <IconButton
                        size="sm"
                        aria-label={t('Delete reservation')}
                        colorScheme="red"
                        onClick={() => handleDeleteClick(info.row.original)}
                        icon={<GoTrashcan />}
                    />
                </HStack>
            );
        },
    }),
];

export default columnHelpers;
