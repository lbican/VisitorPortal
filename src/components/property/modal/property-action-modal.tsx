import React, { useEffect } from 'react';
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

// Used for determining if modal is opened and close it
interface ContentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PropertyActionModal: React.FC<ContentModalProps> = ({ isOpen, onClose }) => {
    const notification = useToastNotification();
    const store = usePropertyStore();
    const { user } = useAuth();

    //Form controls
    const {
        handleSubmit,
        control,
        formState: { errors },
        register,
        reset,
    } = useForm<TNewProperty>({
        shouldUseNativeValidation: false,
        defaultValues: getFormValues(store.editingProperty),
    });

    useEffect(() => {
        reset(getFormValues(store.editingProperty));
    }, [store.editingProperty, reset]);

    const addNewProperty = async (propertyData: TNewProperty) => {
        store.createProperty(propertyData, user?.id).then(() => {
            notification.success('Added new property', 'Successfully added new property!');
        });
    };

    const updateProperty = async (propertyData: TNewProperty) => {
        const data = await PropertyService.updateProperty(propertyData, store.editingProperty?.id);
        if (data) {
            notification.success('Updated property', 'Successfully updated property!');
            return data;
        }
    };

    const disposeModalAndUpdateData = () => {
        onClose();
        reset();
    };

    const handleFormSubmit = (data: TNewProperty) => {
        const actionPromise = store.editingProperty ? updateProperty(data) : addNewProperty(data);

        actionPromise.then(disposeModalAndUpdateData).catch((error) => {
            const errorMsg = store.editingProperty ? 'update' : 'add';
            notification.error(
                'An error has occurred',
                isObject(error) ? `Unable to ${errorMsg} property` : error
            );
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" motionPreset="scale">
            <ModalOverlay />
            <ModalContent>
                <Box as="form">
                    <ModalHeader>
                        {store.editingProperty ? 'Update your' : 'Create new'} property
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <PropertyForm
                            register={register}
                            control={control}
                            errors={errors}
                            existingUrl={store.editingProperty?.image_url}
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
                            isLoading={store.formSubmitting}
                        >
                            {store.editingProperty ? 'Save changes' : 'Create'}
                        </Button>
                    </ModalFooter>
                </Box>
            </ModalContent>
        </Modal>
    );
};

export default PropertyActionModal;
