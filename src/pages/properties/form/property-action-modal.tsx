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
    useBreakpointValue,
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
import FormStepper, { FormStep } from '../../../components/form/form-stepper';
import { useTranslation } from 'react-i18next';

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

const PropertyActionModal: React.FC<PropertyActionModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [submitting, setSubmitting] = useState(false);
    const notification = useToastNotification();
    const { user } = useAuth();
    const isSmallScreen = useBreakpointValue({ base: true, md: false });

    const steps: FormStep[] = [
        { title: t('First'), description: t('📍 Details and Location') },
        { title: t('Second'), description: t('⭐ Categorization') },
        { title: t('Third'), description: t('🖼️ Image') },
        { title: t('Fourth'), description: t('🏘️ Units or Rooms') },
    ];

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
                    notification.success(t('Successfully added new property!'));
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
                    notification.success(t('Successfully updated property!'));
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
            notification.warning(t('Please make changes before attempting to update'));
            return;
        }

        setSubmitting(true);
        const actionPromise = store.editingProperty
            ? updateProperty(data, store.editingProperty.id)
            : addNewProperty(data);

        actionPromise
            .then(disposeModalAndUpdateData)
            .catch((error) => {
                const errorMsg = store.editingProperty
                    ? t('unableToUpdateProperty')
                    : t('unableToAddProperty');
                notification.error(isObject(error) ? errorMsg : error);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const isSubmitDisabled = () => {
        return store.editingProperty
            ? !isValid || submitting
            : activeStep !== steps.length - 1 || !isValid || submitting;
    };

    return (
        <Modal isOpen={isOpen} onClose={cleanupStateAndCloseModal} size="3xl" motionPreset="scale">
            <ModalOverlay />
            <ModalContent>
                <Box as="form">
                    <ModalHeader>
                        {store.editingProperty ? t('editProperty') : t('addNewProperty')}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <HStack justifyContent="space-between">
                            <FormStepper
                                steps={steps}
                                activeStep={activeStep}
                                orientation="vertical"
                                height="24rem"
                                animate={true}
                                hideDetails={!!isSmallScreen}
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
                            {t('Close')}
                        </Button>
                        {activeStep !== 0 && (
                            <Button
                                leftIcon={<MdChevronLeft />}
                                onClick={() => void validateAndChangeStep(false)}
                                isDisabled={activeStep === 0}
                                mr={2}
                            >
                                {t('Previous')}
                            </Button>
                        )}
                        {activeStep !== steps.length - 1 && (
                            <Button
                                rightIcon={<MdChevronRight />}
                                mr={2}
                                onClick={() => void validateAndChangeStep(true)}
                                isDisabled={activeStep === steps.length - 1}
                            >
                                {t('Next')}
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
                            {store.editingProperty ? t('Save changes') : t('Create')}
                        </Button>
                    </ModalFooter>
                </Box>
            </ModalContent>
        </Modal>
    );
};

export default PropertyActionModal;
