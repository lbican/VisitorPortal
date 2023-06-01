import React, { useEffect, useState } from 'react';
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
import { TFormProperty } from '../../../utils/interfaces/typings';
import PropertyForm from './property-form';
import { useAuth } from '../../../context/auth-context';
import useToastNotification from '../../../hooks/useToastNotification';
import { isObject } from 'lodash';
import getFormValues from './modal-values';
import { propertyStore as store } from '../../../mobx/propertyStore';
import { useSteps } from 'chakra-ui-steps';

// Used for determining if modal is opened and close it
interface ContentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type FieldNames = 'name' | 'location' | 'type' | 'image_path' | 'rating' | 'description';

const stepFields: Record<number, FieldNames[]> = {
    0: ['name', 'location'], // fields in Step 1
    1: ['type', 'rating'], // fields in Step 2
    2: ['image_path', 'description'], // fields in Step 3
};

const PropertyActionModal: React.FC<ContentModalProps> = ({ isOpen, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const notification = useToastNotification();
    const { user } = useAuth();
    const stepLabels = ['Basic Information', 'Rating & Type', 'Image', 'Rooms'];

    //Form controls
    const {
        handleSubmit,
        control,
        formState: { errors, isValid },
        register,
        reset,
        setValue,
        watch,
        trigger,
    } = useForm<TFormProperty>({
        mode: 'all',
        shouldUseNativeValidation: false,
        criteriaMode: 'all',
        defaultValues: getFormValues(store.editingProperty),
    });

    const savedFormValues = watch();
    const { nextStep, prevStep, activeStep, setStep } = useSteps({
        initialStep: 0,
    });

    const validateAndChangeStep = async (goToNext: boolean) => {
        const result = await trigger(stepFields[activeStep]);

        if (result) {
            if (goToNext) {
                nextStep();
            } else {
                prevStep();
            }
        }
    };

    useEffect(() => {
        reset(getFormValues(store.editingProperty));
    }, [store.editingProperty, reset]);

    useEffect(() => {
        if (!store.editingProperty) {
            setStep(0);
            reset(getFormValues());
        }
    }, [onClose]);

    const addNewProperty = async (propertyData: TFormProperty): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            store
                .createProperty(propertyData, user?.id)
                .then(() => {
                    notification.success('Added new property', 'Successfully added new property!');
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    const updateProperty = async (
        propertyData: TFormProperty,
        propertyId: string
    ): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            store
                .updateProperty(propertyData, propertyId)
                .then(() => {
                    notification.success('Updated property', 'Successfully updated property!');
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    const disposeModalAndUpdateData = () => {
        onClose();
        reset();
    };

    const handleFormSubmit = (data: TFormProperty) => {
        setSubmitting(true);
        const actionPromise = store.editingProperty
            ? updateProperty(data, store.editingProperty.id)
            : addNewProperty(data);

        actionPromise
            .then(disposeModalAndUpdateData)
            .catch((error) => {
                const errorMsg = store.editingProperty ? 'update' : 'add';
                notification.error(
                    'An error has occurred',
                    isObject(error) ? `Unable to ${errorMsg} property` : error
                );
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" motionPreset="scale">
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
                            existingPath={
                                store.editingProperty?.image_path || savedFormValues.image_path
                            }
                            setValue={setValue}
                            activeStep={activeStep}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" variant="outline" mr={2} onClick={onClose}>
                            Close
                        </Button>
                        <Button
                            onClick={() => validateAndChangeStep(false)}
                            isDisabled={activeStep === 0}
                            mr={2}
                        >
                            Previous
                        </Button>
                        {activeStep !== stepLabels.length - 1 && (
                            <Button
                                mr={2}
                                onClick={() => validateAndChangeStep(true)}
                                isDisabled={activeStep === stepLabels.length - 1}
                            >
                                Next
                            </Button>
                        )}
                        <Button
                            type="submit"
                            leftIcon={<AiOutlineSave />}
                            onClick={handleSubmit(handleFormSubmit)}
                            colorScheme="green"
                            alignSelf="flex-end"
                            isLoading={submitting}
                            isDisabled={
                                store.editingProperty
                                    ? !isValid || submitting
                                    : activeStep !== stepLabels.length - 1 || !isValid || submitting
                            }
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
