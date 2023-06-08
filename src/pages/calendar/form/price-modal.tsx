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
} from '@chakra-ui/react';
import { IUnit } from '../../../utils/interfaces/typings';
import { useForm } from 'react-hook-form';
import { CalendarService, IDatePrice } from '../../../services/calendar-service';
import useToastNotification from '../../../hooks/useToastNotification';
import { MdOutlineSave } from 'react-icons/md';

interface PriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    unit: IUnit;
    date_range: [Date, Date];
    onValueSubmitted: (datePrice: IDatePrice) => void;
}

const PriceModal: React.FC<PriceModalProps> = ({
    isOpen,
    onClose,
    unit,
    date_range,
    onValueSubmitted,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const notification = useToastNotification();

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
            .then((data) => {
                notification.success(`Assigned prices for ${formattedStart} - ${formattedEnd}`);
                onValueSubmitted(data);
                onClose();
            })
            .catch((error) => {
                notification.error('Could not assign prices!');
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
                <ModalHeader>Create your account</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel htmlFor="price_input">Set price for {unit.name}</FormLabel>
                        <NumberInput min={1} keepWithinRange={true} id="price_input">
                            <NumberInputField {...register('price')} />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme="green"
                        mr={3}
                        leftIcon={<MdOutlineSave />}
                        onClick={handleSubmit(savePrice)}
                        isLoading={submitting}
                    >
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PriceModal;
