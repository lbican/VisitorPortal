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
} from '@chakra-ui/react';
import { AiOutlineSave } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { TProperty } from '../../../utils/interfaces/typings';
import PropertyForm from '../../../pages/properties/property-form';

interface ContentModalProps {
    property: TProperty | null;
    isOpen: boolean;
    onClose: () => void;
}

const PropertyActionModal: React.FC<ContentModalProps> = ({ property, isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors },
        register,
    } = useForm<TProperty>();

    const handleFormSubmit = (data: TProperty) => {
        console.log(data);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" motionPreset="scale">
            <ModalOverlay />
            <ModalContent>
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
                        leftIcon={<AiOutlineSave />}
                        onClick={handleSubmit(handleFormSubmit)}
                        colorScheme="green"
                        alignSelf="flex-end"
                        isLoading={loading}
                    >
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PropertyActionModal;
