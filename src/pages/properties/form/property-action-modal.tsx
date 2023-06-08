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
    HStack,
    useSteps,
} from '@chakra-ui/react';
import { AiOutlineSave } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { TFormProperty } from '../../../utils/interfaces/typings';
import PropertyForm from './property-form';
import { useAuth } from '../../../context/auth-context';
import useToastNotification from '../../../hooks/useToastNotification';
import { isEqual, isObject } from 'lodash';
import getFormValues from './modal-values';
import { propertyStore as store } from '../../../mobx/propertyStore';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import FormStepper from '../../../components/form/form-stepper';

// Used for determining if modal is opened and close it
interface PropertyActionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type FieldNames = 'name' | 'location' | 'type' | 'image_path' | 'rating' | 'description';

const stepFormFields: Record<number, FieldNames[]> = {
    0: ['name', 'location'], // fields in Step 1
    1: ['type', 'rating'], // fields in Step 2
    2: ['image_path', 'description'], // fields in Step 3
};

const steps = [
    { title: 'First', description: '📍 Details and Location' },
    { title: 'Second', description: '⭐ Categorization' },
    { title: 'Third', description: '🖼️ Image' },
    { title: 'Fourth', description: '🏘️ Units or Rooms' },
];

const PropertyActionModal: React.FC<PropertyActionModalProps> = ({ isOpen, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const notification = useToastNotification();
    const { user } = useAuth();

    const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    });

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

    const validateAndChangeStep = async (shouldProceed: boolean) => {
        const result = await trigger(stepFormFields[activeStep]);

        if (result) {
            if (shouldProceed) {
                goToNext();
            } else {
                goToPrevious();
            }
        }
    };

    const cleanupStateAndCloseModal = () => {
        setActiveStep(0);
        reset();
        onClose();
    };

    useEffect(() => {
        reset(getFormValues(store.editingProperty));
    }, [store.editingProperty]);

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

    const canExecuteUpdate = () => {
        if (!store.editingProperty) {
            return true;
        }

        const formValues = watch();

        return !isEqual(formValues, getFormValues(store.editingProperty));
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
        cleanupStateAndCloseModal();
    };

    const handleFormSubmit = (data: TFormProperty) => {
        if (!canExecuteUpdate()) {
            notification.warning(
                'Could not update',
                'Please make changes before attempting to update'
            );
            return;
        }

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

    function isSubmitDisabled() {
        return store.editingProperty
            ? !isValid || submitting
            : activeStep !== steps.length - 1 || !isValid || submitting;
    }

    return (
        <Modal isOpen={isOpen} onClose={cleanupStateAndCloseModal} size="3xl" motionPreset="scale">
            <ModalOverlay />
            <ModalContent>
                <Box as="form">
                    <ModalHeader>
                        {store.editingProperty ? 'Update your' : 'Create new'} property
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <HStack justifyContent="space-between">
                            <FormStepper
                                steps={steps}
                                activeStep={activeStep}
                                orientation="vertical"
                            />
                            <PropertyForm
                                register={register}
                                control={control}
                                errors={errors}
                                watch={watch}
                                setValue={setValue}
                                activeStep={activeStep}
                            />
                        </HStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="red"
                            variant="outline"
                            mr={2}
                            onClick={cleanupStateAndCloseModal}
                        >
                            Close
                        </Button>
                        {activeStep !== 0 && (
                            <Button
                                leftIcon={<MdChevronLeft />}
                                onClick={() => void validateAndChangeStep(false)}
                                isDisabled={activeStep === 0}
                                mr={2}
                            >
                                Previous
                            </Button>
                        )}
                        {activeStep !== steps.length - 1 && (
                            <Button
                                rightIcon={<MdChevronRight />}
                                mr={2}
                                onClick={() => void validateAndChangeStep(true)}
                                isDisabled={activeStep === steps.length - 1}
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
                            isDisabled={isSubmitDisabled()}
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
