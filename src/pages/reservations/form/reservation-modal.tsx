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
import { ReservationService } from '../../../services/reservation-service';
import i18n from 'i18next';
import { differenceInDays } from 'date-fns';
import { addDays } from 'date-fns/fp';
import { observer } from 'mobx-react-lite';
import { propertyStore as store, propertyStore } from '../../../mobx/propertyStore';
import { reservationStore } from '../../../mobx/reservationStore';
import getReservationFormValues from './modal-values';
import { isObject } from 'lodash';
import { Country } from '../../../utils/interfaces/utils';
import Autocomplete, {
    ILabel,
    mapToAutocompleteLabels,
    mapValueToLabel,
} from '../../../components/common/input/autocomplete';
import { SingleValue } from 'react-select';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    unit: IUnit;
    date_range: [Date, Date];
}

const ReservationModal: React.FC<ReservationModalProps> = ({
    isOpen,
    onClose,
    unit,
    date_range,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [reservationPrice, setReservationPrice] = useState<number | null>(null);
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<Country>();
    const notification = useToastNotification();
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<IFormReservation & IGuest>({
        shouldUseNativeValidation: false,
        defaultValues: getReservationFormValues(
            unit.id,
            date_range,
            reservationStore.editingReservation
        ),
    });

    const resetForm = () => {
        reset(
            getReservationFormValues(
                unit.id,
                [date_range[0], date_range[1]],
                reservationStore.editingReservation
            )
        );
    };

    const disposeModalAndUpdateData = () => {
        reservationStore.setEditingReservation();
        onClose();
        resetForm();
    };

    const handleFormSubmit = (data: IFormReservation & IGuest) => {
        setSubmitting(true);
        const actionPromise = reservationStore.editingReservation
            ? updateExistingReservation(data)
            : addNewReservation(data);

        actionPromise
            .then(disposeModalAndUpdateData)
            .catch((error) => {
                const errorMsg = store.editingProperty
                    ? t('Could not update existing reservation!')
                    : t('Could not add new reservation!');
                notification.error(isObject(error) ? errorMsg : error);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    useEffect(() => {
        ReservationService.getTotalPrice(unit.id, date_range)
            .then((price) => {
                setReservationPrice(price);
                setValue('total_price', price ?? 0);
            })
            .catch(() => {
                setReservationPrice(0);
            });

        ReservationService.fetchCountries()
            .then((countries) => {
                setCountries(countries);
            })
            .catch((error) => {
                console.error(error);
            });

        resetForm();
    }, [date_range, unit]);

    const addNewReservation = (data: IFormReservation & IGuest) => {
        return new Promise<void>((resolve, reject) => {
            reservationStore
                .createNewReservation(data)
                .then(() => {
                    notification.success(t('Created new reservation'));
                    resolve();
                })
                .catch((error) => {
                    notification.error(t(''));
                    console.error(error);
                    reject(error);
                });
        });
    };

    const updateExistingReservation = (data: IFormReservation & IGuest) => {
        return new Promise<void>((resolve, reject) => {
            reservationStore
                .updateExistingReservation(data)
                .then(() => {
                    notification.success(t('Updated existing reservation!'));
                    resolve();
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    };

    const onCountrySelect = (newValue: SingleValue<ILabel>) => {
        if (newValue?.value === selectedCountry?.id) {
            return;
        }

        const index = countries.findIndex((value) => {
            return value.id === newValue?.value;
        });
        if (index >= 0) {
            setSelectedCountry(countries[index]);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {reservationStore.editingReservation
                        ? t('Update existing reservation')
                        : t('Add new reservation')}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Heading as="h3" size="md">
                        {propertyStore.currentProperty?.name} | {unit.name}
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
                    <HStack mt={2} alignItems="flex-start" justifyContent="space-between">
                        <FormControl>
                            <FormLabel htmlFor="guests_num_input">{t('Guests Number')}</FormLabel>
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
                        <FormControl>
                            <FormLabel>{t('Guest country')}</FormLabel>
                            <Autocomplete
                                placeholder={t('Select country') ?? ''}
                                onSelect={onCountrySelect}
                                options={mapToAutocompleteLabels(countries)}
                                value={mapValueToLabel(selectedCountry)}
                                isLoading={countries.length === 0}
                            />
                        </FormControl>
                    </HStack>
                    <FormControl mt={2}>
                        <FormLabel htmlFor="is_booking_input">
                            {t('Booking reservation?')}
                        </FormLabel>
                        <Checkbox
                            defaultChecked={
                                reservationStore.editingReservation?.is_booking_reservation ?? false
                            }
                            id="is_booking_input"
                            size="lg"
                            colorScheme="blue"
                            {...register('is_booking_reservation')}
                        >
                            {t('Yes')}
                        </Checkbox>
                    </FormControl>
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
                                    departureDate: addDays(1, date_range[1]).toLocaleDateString(
                                        i18n.language ?? 'en'
                                    ),
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
                            <Text as="b">{t('totalPrice', { totalPrice: reservationPrice })}</Text>
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
                        onClick={handleSubmit(handleFormSubmit)}
                        isLoading={submitting}
                    >
                        {reservationStore.editingReservation ? t('Save changes') : t('Create')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(ReservationModal);
