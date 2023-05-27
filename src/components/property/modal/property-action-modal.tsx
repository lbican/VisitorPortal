import React, { useState } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Box,
} from '@chakra-ui/react';
import { AiOutlineSave } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { TNewProperty } from '../../../utils/interfaces/typings';
import PropertyForm from '../../../pages/properties/property-form';
import PropertyService from '../../../services/property-service';
import { useAuth } from '../../../context/auth-context';
import useToastNotification from '../../../hooks/useToastNotification';
import { isObject } from 'lodash';

interface ContentModalProps {
    refetch: () => void;
    isOpen: boolean;
    onClose: () => void;
}

const PropertyActionModal: React.FC<ContentModalProps> = ({ isOpen, onClose, refetch }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const notification = useToastNotification();
    const {
        handleSubmit,
        control,
        formState: { errors },
        register,
        reset,
    } = useForm<TNewProperty>();

    const handleFormSubmit = (data: TNewProperty) => {
        setLoading(true);
        PropertyService.createProperty(data, user?.id)
            .then(() => {
                notification.success('Property added', 'Successfully added new property!');
                onClose();
                refetch();
                reset();
            })
            .catch((error) => {
                notification.error(
                    'An error has occured',
                    isObject(error) ? 'Unable to add new property' : error
                );
            })
            .finally(() => setLoading(false));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" motionPreset="scale">
            <ModalOverlay />
            <ModalContent>
                <Box as="form">
                    <ModalHeader>Create new property</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <PropertyForm
                            register={register}
                            property={null}
                            control={control}
                            errors={errors}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" variant="outline" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button
                            type="submit"
                            leftIcon={<AiOutlineSave />}
                            onClick={handleSubmit(handleFormSubmit)}
                            colorScheme="green"
                            alignSelf="flex-end"
                            isLoading={loading}
                        >
                            Create
                        </Button>
                    </ModalFooter>
                </Box>
            </ModalContent>
        </Modal>
    );
};

export default PropertyActionModal;
