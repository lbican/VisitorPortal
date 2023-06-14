import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IFormReservation, IGuest, IUnit } from '../../../utils/interfaces/typings';
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormErrorMessage,
    FormLabel,
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
    Skeleton,
    Text,
    Textarea,
} from '@chakra-ui/react';
import { MdOutlineSave } from 'react-icons/md';
import useToastNotification from '../../../hooks/useToastNotification';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { ReservationService } from '../../../services/reservation-service';
import i18n from 'i18next';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    unit: IUnit;
    date_range: [Date, Date];
    onValueSubmitted?: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
    isOpen,
    onClose,
    unit,
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
    } = useForm<IFormReservation & IGuest>({
        shouldUseNativeValidation: false,
        defaultValues: {
            guest_id: uuidv4(),
            unit_id: unit.id,
            date_range: [date_range[0], date_range[1]],
            total_price: 0,
            note: '',
            first_name: '',
            last_name: '',
            guests_num: 1,
        },
    });

    useEffect(() => {
        ReservationService.getTotalPrice(unit.id, date_range)
            .then((price) => {
                setReservationPrice(price);
            })
            .catch(() => {
                setReservationPrice(0);
            });
    }, [date_range, unit]);

    const addNewReservation = (data: IFormReservation & IGuest) => {
        console.log(data);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('Add new reservation')}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Box mb={2}>
                        <Text>
                            {t('arrivalDate', {
                                arrivalDate: date_range[0].toLocaleDateString(
                                    i18n.language ?? 'en'
                                ),
                            })}
                        </Text>
                        <Text>
                            {t('departureDate', {
                                departureDate: date_range[1].toLocaleDateString(
                                    i18n.language ?? 'en'
                                ),
                            })}
                        </Text>
                        <Text>{t('totalPrice', { totalPrice: reservationPrice })}</Text>
                    </Box>
                    <FormLabel>{t('Reservation holder')}</FormLabel>
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
                            <FormErrorMessage>{errors?.first_name?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.last_name}>
                            <FormLabel htmlFor="last_name">{t('Last Name')}</FormLabel>
                            <Input
                                id="last_name"
                                {...register('last_name', {
                                    required: t('Last Name is required') ?? true,
                                })}
                            />
                            <FormErrorMessage>{errors?.last_name?.message}</FormErrorMessage>
                        </FormControl>
                    </HStack>
                    <FormLabel mt={4}>{t('Reservation details')}</FormLabel>
                    <Divider my={2} />

                    <FormControl isInvalid={!!errors.guests_num}>
                        <FormLabel htmlFor="guests_num">{t('Guests Number')}</FormLabel>
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
                        <FormErrorMessage>{errors?.guests_num?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel htmlFor="note">{t('Note')}</FormLabel>
                        <Textarea id="note" resize="none" {...register('note')} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <HStack spacing={2}>
                        <Button onClick={onClose} colorScheme="red" variant="outline">
                            {t('Cancel')}
                        </Button>
                        <Button
                            colorScheme="green"
                            ml={3}
                            leftIcon={<MdOutlineSave />}
                            onClick={() => {
                                handleSubmit(addNewReservation);
                            }}
                            isLoading={submitting}
                        >
                            {t('Save')}
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
