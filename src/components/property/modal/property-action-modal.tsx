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
import { IProperty, PropertyType, TNewProperty } from '../../../utils/interfaces/typings';
import PropertyForm from '../../../pages/properties/property-form';
import PropertyService from '../../../services/property-service';
import { useAuth } from '../../../context/auth-context';
import useToastNotification from '../../../hooks/useToastNotification';
import { isObject } from 'lodash';

interface ContentModalProps {
    refetch: () => void;
    isOpen: boolean;
    onClose: () => void;
    property?: IProperty;
}

const getFormValues = (property?: TNewProperty) => {
    return property
        ? {
              name: property.name,
              type: property.type,
              rating: property.rating,
              location: property.location,
              description: property.description,
              image_url: property.image_url,
          }
        : {
              name: '',
              type: PropertyType.APARTMENT,
              rating: 0,
              location: '',
              description: undefined,
              image_url: '',
          };
};
const PropertyActionModal: React.FC<ContentModalProps> = ({
    isOpen,
    onClose,
    refetch,
    property,
}) => {
    const [loading, setLoading] = useState(false);
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
        defaultValues: getFormValues(property),
    });

    useEffect(() => {
        reset(getFormValues(property));
    }, [property, reset]);

    const handleFormSubmit = (data: TNewProperty) => {
        setLoading(true);

        const actionPromise = property
            ? PropertyService.updateProperty(property.id, data)
            : PropertyService.createProperty(data, user?.id);

        actionPromise
            .then(() => {
                const actionMessage = property ? 'Updated property' : 'Added new property';
                notification.success(actionMessage, `Successfully ${actionMessage.toLowerCase()}!`);
                onClose();
                refetch();
                reset();
            })
            .catch((error) => {
                notification.error(
                    'An error has occured',
                    isObject(error)
                        ? `Unable to ${property ? 'update' : 'add'} new property`
                        : error
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
                            control={control}
                            errors={errors}
                            existingUrl={property?.image_url}
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
                            {property ? 'Save changes' : 'Create'}
                        </Button>
                    </ModalFooter>
                </Box>
            </ModalContent>
        </Modal>
    );
};

export default PropertyActionModal;
