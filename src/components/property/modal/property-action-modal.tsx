import React, { useCallback, useEffect, useState } from 'react';
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
import getFormValues from './modal-values';
import { usePropertyStore } from '../../../mobx/propertyStoreContext';

interface ContentModalProps {
    refetch: () => void;
    isOpen: boolean;
    onClose: () => void;
}

const PropertyActionModal: React.FC<ContentModalProps> = ({ isOpen, onClose, refetch }) => {
    const { editingProperty } = usePropertyStore();
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuth();
    const notification = useToastNotification();
    const {
        handleSubmit,
        control,
        formState: { errors },
        register,
        reset,
    } = useForm<TNewProperty>({
        shouldUseNativeValidation: false,
        defaultValues: getFormValues(editingProperty),
    });

    useEffect(() => {
        reset(getFormValues(editingProperty));
    }, [editingProperty, reset]);

    const addNewProperty = useCallback(
        async (propertyData: TNewProperty) => {
            await PropertyService.createProperty(propertyData, user?.id);
            notification.success('Added new property', 'Successfully added new property!');
        },
        [user, notification]
    );

    const updateProperty = useCallback(
        async (propertyData: TNewProperty) => {
            await PropertyService.updateProperty(propertyData, editingProperty?.id);
            notification.success('Updated property', 'Successfully updated property!');
        },
        [editingProperty, notification]
    );

    const disposeModalAndUpdateData = () => {
        onClose();
        reset();
    };

    const handleFormSubmit = (data: TNewProperty) => {
        setSubmitting(true);

        const actionPromise = editingProperty ? updateProperty(data) : addNewProperty(data);

        actionPromise
            .then(disposeModalAndUpdateData)
            .catch((error) => {
                const errorMsg = editingProperty ? 'update' : 'add';
                notification.error(
                    'An error has occurred',
                    isObject(error) ? `Unable to ${errorMsg} property` : error
                );
            })
            .finally(() => setSubmitting(false));
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
                            control={control}
                            errors={errors}
                            existingUrl={editingProperty?.image_url}
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
                            isLoading={submitting}
                        >
                            {editingProperty ? 'Save changes' : 'Create'}
                        </Button>
                    </ModalFooter>
                </Box>
            </ModalContent>
        </Modal>
    );
};

export default PropertyActionModal;
