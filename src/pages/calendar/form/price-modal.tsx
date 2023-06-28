import React, { useState } from 'react';
import {
    Button,
    FormControl,
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
    FormLabel,
    HStack,
    InputGroup,
    InputLeftAddon,
} from '@chakra-ui/react';
import { IUnit } from '../../../utils/interfaces/typings';
import { useForm } from 'react-hook-form';
import { CalendarService } from '../../../services/calendar-service';
import useToastNotification from '../../../hooks/useToastNotification';
import { MdOutlineSave } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { reservationStore } from '../../../mobx/reservationStore';

interface PriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    unit: IUnit;
    date_range: [Date, Date];
}

const PriceModal: React.FC<PriceModalProps> = ({ isOpen, onClose, unit, date_range }) => {
    const [submitting, setSubmitting] = useState(false);
    const notification = useToastNotification();
    const { t } = useTranslation();

    const { register, handleSubmit } = useForm({
        shouldUseNativeValidation: false,
        defaultValues: {
            price: 0,
        },
    });

    const savePrice = async (data: { price: number }) => {
        setSubmitting(true);
        const formattedStart = date_range[0].toLocaleDateString();
        const formattedEnd = date_range[1].toLocaleDateString();

        CalendarService.insertDatePrice({
            price: data.price,
            date_range: date_range,
            unit_id: unit.id,
        })
            .then(() => {
                notification.success(
                    t('assignedPricesDates', {
                        dateStart: formattedStart,
                        dateEnd: formattedEnd,
                    })
                );
                reservationStore.fetchDatePrices(unit.id);
                onClose();
            })
            .catch((error) => {
                notification.error(t('Could not assign prices!'));
                console.error(error);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('Assign price')}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel htmlFor="price_input">
                            {t('setPrice', { unitName: unit.name })}
                        </FormLabel>
                        <NumberInput
                            min={1}
                            keepWithinRange={true}
                            id="price_input"
                            as={InputGroup}
                        >
                            <InputLeftAddon>€</InputLeftAddon>
                            <NumberInputField {...register('price')} />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
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
                            onClick={handleSubmit(savePrice)}
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

export default observer(PriceModal);
