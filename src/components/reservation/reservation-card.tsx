import { observer } from 'mobx-react-lite';
import { IReservation } from '../../utils/interfaces/typings';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Divider,
    Heading,
    HStack,
    IconButton,
    Text,
    useDisclosure,
    VStack,
    Tag,
    Flex,
} from '@chakra-ui/react';
import { TbBrandBooking } from 'react-icons/tb';
import { BiBookOpen } from 'react-icons/bi';
import { GoTrashcan } from 'react-icons/go';
import ReactiveButton from '../common/input/reactive-button';
import { AiFillEdit, AiOutlineEdit } from 'react-icons/ai';
import AlertDialogComponent from '../common/feedback/alert-dialog-component';
import React from 'react';
import CardWrapper from './card/card-wrapper';
import useToastNotification from '../../hooks/useToastNotification';
import { reservationStore } from '../../mobx/reservationStore';
import i18n from 'i18next';
const ReservationCard = (props: IReservation) => {
    const {
        isOpen: isOpenDeleteAlert,
        onOpen: onOpenDeleteAlert,
        onClose: onCloseDeleteAlert,
    } = useDisclosure();

    const { first_name, last_name, guests_num } = props.guest;
    const { date_range, note } = props;
    const notification = useToastNotification();
    const { t } = useTranslation();

    const confirmDeleteReservation = () => {
        reservationStore
            .deleteReservation(props.id)
            .then(() => {
                onCloseDeleteAlert();
                notification.success(t('Successfully deleted reservation'));
            })
            .catch((e) => {
                console.error(e);
                notification.error(t('Could not delete reservation'));
            });
    };

    return (
        <CardWrapper icon={props.is_booking_reservation ? TbBrandBooking : BiBookOpen}>
            <Flex w="full" flexDirection={{ lg: 'row', base: 'column' }}>
                <VStack
                    spacing={1}
                    mb={3}
                    textAlign="left"
                    alignItems="flex-start"
                    w="full"
                >
                    <Heading
                        as="h2"
                        size="md"
                        lineHeight={1.2}
                        fontWeight="bold"
                        w="100%"
                    >
                        {date_range[0].toLocaleDateString(i18n.language ?? 'en')}
                    </Heading>
                    {props.is_booking_reservation && (
                        <Text as="small" size="sm">
                            {t('This is Booking.com® reservation')}
                        </Text>
                    )}
                    <Divider />
                    <Text size="lg" as="b">
                        {first_name} {last_name}
                    </Text>
                    <Text size="lg" as="b">
                        Number of guests: <Tag borderRadius="full">{guests_num}</Tag> /{' '}
                        <Tag borderRadius="full">
                            {props.unit.capacity} (max capacity)
                        </Tag>
                    </Text>
                    <Divider />
                    <Text as="b">{t('Note')}</Text>
                    <Text fontSize="sm" noOfLines={2}>
                        {note || t('No note')}
                    </Text>
                </VStack>
                <Box>
                    <VStack alignItems="flex-end" p={4}>
                        <Text>
                            {t('departureDate', {
                                departureDate: date_range[1].toLocaleDateString(
                                    i18n.language ?? 'en'
                                ),
                            })}
                        </Text>
                        <Text as="b">
                            {t('totalPrice', { totalPrice: props.total_price })}
                        </Text>
                    </VStack>
                    <HStack w="full" justifyContent="flex-end">
                        <IconButton
                            aria-label="Delete reservation"
                            icon={<GoTrashcan />}
                            colorScheme="red"
                            onClick={onOpenDeleteAlert}
                        />
                    </HStack>
                </Box>
            </Flex>

            <AlertDialogComponent
                isLoading={reservationStore.isDeleting}
                isOpen={isOpenDeleteAlert}
                onClose={onCloseDeleteAlert}
                onConfirm={confirmDeleteReservation}
                dialogBody={t('confirmDeleteReservation', {
                    reservationHolder: `${first_name} ${last_name}`,
                })}
                dialogHeader={t('Confirm deletion')}
                dialogConfirmText={t('Delete')}
                dialogDeclineText={t('Cancel')}
            />
        </CardWrapper>
    );
};

export default observer(ReservationCard);
