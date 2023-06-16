import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IFormReservation, IGuest, IUnit } from '../../../utils/interfaces/typings';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Text,
    Textarea,
} from '@chakra-ui/react';
import { MdOutlineSave } from 'react-icons/md';
import useToastNotification from '../../../hooks/useToastNotification';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { ReservationService } from '../../../services/reservation-service';
import i18n from 'i18next';
import { differenceInDays } from 'date-fns';
import { addDays } from 'date-fns/fp';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    unit: IUnit;
    property_name: string;
    date_range: [Date, Date];
    onValueSubmitted: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
    isOpen,
    onClose,
    unit,
    property_name,
    date_range,
    onValueSubmitted,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const notification = useToastNotification();
    const { t } = useTranslation();
    const [reservationPrice, setReservationPrice] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<IFormReservation & IGuest>({
        shouldUseNativeValidation: false,
        defaultValues: {
            unit_id: unit.id,
            is_booking_reservation: false,
            date_range: [date_range[0], date_range[1]],
            total_price: 0,
            note: '',
            first_name: '',
            last_name: '',
            guests_num: 1,
        },
    });

    useEffect(() => {
        reset({
            guest_id: uuidv4(),
            unit_id: unit.id,
            is_booking_reservation: false,
            date_range: [date_range[0], date_range[1]],
            total_price: 0,
            note: '',
            first_name: '',
            last_name: '',
            guests_num: 1,
        });
    }, [date_range, unit, reset]);

    useEffect(() => {
        ReservationService.getTotalPrice(unit.id, date_range)
            .then((price) => {
                setReservationPrice(price);
                setValue('total_price', price ?? 0);
            })
            .catch(() => {
                setReservationPrice(0);
            });
    }, [date_range, unit]);

    const addNewReservation = (data: IFormReservation & IGuest) => {
        console.log(data);
        setSubmitting(true);
        ReservationService.insertNewReservation(data)
            .then(() => {
                notification.success(t('Created new reservation'));
                onValueSubmitted();
                onClose();
            })
            .catch((error) => {
                notification.error(t('Could not add new reservation!'));
                console.error(error);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('Add new reservation')}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Heading as="h3" size="md">
                        {property_name} | {unit.name}
                    </Heading>
                    <Text as="b">{t('maxCapacity', { maxCapacity: unit.capacity })}</Text>
                    <FormLabel mt={6}>{t('Reservation holder')}</FormLabel>
                    <Divider my={2} />
                    <HStack w="full">
                        <FormControl isInvalid={!!errors.first_name}>
                            <FormLabel htmlFor="first_name">{t('First Name')}</FormLabel>
                            <Input
                                id="first_name"
                                {...register('first_name', {
                                    required: t('First Name is required') ?? true,
                                })}
                            />
                            <FormErrorMessage>
                                {errors?.first_name?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.last_name}>
                            <FormLabel htmlFor="last_name">{t('Last Name')}</FormLabel>
                            <Input
                                id="last_name"
                                {...register('last_name', {
                                    required: t('Last Name is required') ?? true,
                                })}
                            />
                            <FormErrorMessage>
                                {errors?.last_name?.message}
                            </FormErrorMessage>
                        </FormControl>
                    </HStack>
                    <HStack mt={2} alignItems="flex-start" justifyContent="space-between">
                        <FormControl
                            isInvalid={!!errors.guests_num}
                            w="25%"
                            justifySelf="flex-end"
                        >
                            <FormLabel htmlFor="guests_num">
                                {t('Guests Number')}
                            </FormLabel>
                            <NumberInput
                                min={1}
                                max={unit.capacity}
                                keepWithinRange={true}
                                id="guests_num_input"
                            >
                                <NumberInputField
                                    {...register('guests_num', {
                                        required: t('Guest Number is required') ?? true,
                                    })}
                                />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <FormErrorMessage>
                                {errors?.guests_num?.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl w="max-content">
                            <FormLabel htmlFor="is_booking_input">
                                {t('Booking reservation?')}
                            </FormLabel>
                            <Checkbox
                                id="is_booking_input"
                                size="lg"
                                colorScheme="blue"
                                {...register('is_booking_reservation')}
                            >
                                {t('Yes')}
                            </Checkbox>
                        </FormControl>
                    </HStack>
                    <FormLabel mt={4}>{t('Reservation details')}</FormLabel>
                    <Divider my={2} />

                    <HStack mt={4} alignItems="center">
                        <FormControl>
                            <FormLabel htmlFor="note">{t('Note')}</FormLabel>
                            <Textarea id="note" resize="none" {...register('note')} />
                        </FormControl>
                        <Box mb={2} w="full" alignSelf="flex-end" textAlign="right">
                            <Text>
                                {t('arrivalDate', {
                                    arrivalDate: date_range[0].toLocaleDateString(
                                        i18n.language ?? 'en'
                                    ),
                                })}
                            </Text>
                            <Text>
                                {t('departureDate', {
                                    departureDate: addDays(
                                        1,
                                        date_range[1]
                                    ).toLocaleDateString(i18n.language ?? 'en'),
                                })}
                            </Text>
                            <Text>
                                {t('numberOfNights', {
                                    numNights: differenceInDays(
                                        addDays(1, date_range[1]),
                                        date_range[0]
                                    ),
                                })}
                            </Text>
                            <Text as="b">
                                {t('totalPrice', { totalPrice: reservationPrice })}
                            </Text>
                        </Box>
                    </HStack>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={onClose} colorScheme="red" variant="outline">
                        {t('Cancel')}
                    </Button>
                    <Button
                        colorScheme="green"
                        ml={3}
                        leftIcon={<MdOutlineSave />}
                        onClick={handleSubmit(addNewReservation)}
                        isLoading={submitting}
                    >
                        {t('Save')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
