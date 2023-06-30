import React from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { IReservation, ReservationType } from '../../../utils/interfaces/typings';
import { Button, HStack, Icon, IconButton, Text } from '@chakra-ui/react';
import { GoTrash } from 'react-icons/go';
import i18n, { TFunction } from 'i18next';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';
import { Country } from '../../../utils/interfaces/utils';
import { IoChevronDown, IoChevronForward } from 'react-icons/io5';
import { TbBrandAirbnb, TbBrandBooking } from 'react-icons/tb';
import { BiBookOpen } from 'react-icons/bi';
import TypeTag from '../../../components/reservation/type-tag';
import { useTranslation } from 'react-i18next';

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

const getReservationTypeIcon = (type: ReservationType) => {
    switch (type) {
        case ReservationType.AIRBNB:
            return <TypeTag icon={TbBrandAirbnb} label={type} colorScheme="red" />;
        case ReservationType.BOOKING:
            return <TypeTag icon={TbBrandBooking} label={type} colorScheme="facebook" />;
        case ReservationType.CUSTOM:
            return <TypeTag icon={BiBookOpen} label={type} colorScheme="green" />;
    }
};

const getCountryFlag = (country: Country, t: TFunction) => {
    return (
        <HStack>
            <img
                src={`https://flagcdn.com/${country.id.toLowerCase()}.svg`}
                alt={country.id}
                width="32"
                height="16"
            />
            <Text>{t(country.name)}</Text>
        </HStack>
    );
};

type HandleButtonClick = (reservation: IReservation) => void;
const columnHelpers = (
    t: TFunction,
    handleEditClick: HandleButtonClick,
    handleDeleteClick: HandleButtonClick
): Array<ColumnDef<IReservation, any>> => [
    {
        id: 'expander',
        header: () => null,
        cell: ({ row }) => {
            return row.getCanExpand() ? (
                <IconButton
                    variant="ghost"
                    aria-label="expand_table"
                    {...{
                        onClick: row.getToggleExpandedHandler(),
                        style: { cursor: 'pointer' },
                    }}
                    icon={row.getIsExpanded() ? <IoChevronDown /> : <IoChevronForward />}
                />
            ) : (
                '🔵'
            );
        },
    },
    columnHelper.accessor('guest.first_name', {
        header: t('First Name'),
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('guest.last_name', {
        header: t('Last Name'),
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
    }),
    columnHelper.accessor('guest.country', {
        header: t('Guest country'),
        cell: (info) => getCountryFlag(info.getValue(), t),
        footer: (props) => props.column.id,
    }),
    columnHelper.accessor('guest.guests_num', {
        header: t('Guests Number'),
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
    }),
    columnHelper.accessor('type', {
        header: t('Reservation type'),
        cell: (info) => getReservationTypeIcon(info.getValue()),
        footer: (props) => props.column.id,
    }),
    columnHelper.accessor('date_range', {
        header: t('Date Range'),
        cell: (info) => mapDateToLocaleString(info.getValue()),
        footer: (props) => props.column.id,
    }),
    columnHelper.accessor('total_price', {
        header: t('Total Price'),
        cell: (info) => <Text as="b">{info.getValue()}€</Text>,
        footer: (props) => props.column.id,
        meta: { isNumeric: true },
    }),
    columnHelper.accessor('fulfilled', {
        header: t('Fulfilled'),
        cell: (info) => getIcon(info.getValue()),
        footer: (props) => props.column.id,
    }),
    columnHelper.accessor('prepayment_paid', {
        header: t('Advance Payment Paid'),
        cell: (info) => getIcon(info.getValue()),
        footer: (props) => props.column.id,
    }),
    columnHelper.display({
        id: 'actions',
        header: t('Actions'),
        footer: (props) => props.column.id,
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
                        icon={<GoTrash />}
                    />
                </HStack>
            );
        },
    }),
];

export default columnHelpers;
