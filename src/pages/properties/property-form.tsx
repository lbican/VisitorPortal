import React, { ReactElement, useState } from 'react';
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    VStack,
    Button,
} from '@chakra-ui/react';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { TNewProperty } from '../../utils/interfaces/typings';
import FileDropzone from '../../components/common/file-dropzone';
import RadioButtonGroup from '../../components/common/radio-button-group';
import FileService, { IUploadedImage } from '../../services/file-service';
import { GiTrashCan } from 'react-icons/all';
import ProgressiveImage from '../../components/common/progressive-image';
import ReactStars from 'react-stars';
import useToastNotification from '../../hooks/useToastNotification';
import { useAuth } from '../../context/auth-context';
import PropertyService from '../../services/property-service';

interface PropertyFormProps {
    register: UseFormRegister<TNewProperty>;
    errors: FieldErrors<TNewProperty>;
    control: Control<TNewProperty>;
    existingPath?: string;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
    register,
    errors,
    control,
    existingPath,
}): ReactElement => {
    const [image, setImage] = useState<IUploadedImage | undefined>(
        PropertyService.getPropertyImage(existingPath)
    );
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const fileService = new FileService('property_images', user?.id);
    const notification = useToastNotification();

    return (
        <VStack spacing={4} justifyContent="flex-start">
            <HStack spacing={2} w="full">
                <FormControl isInvalid={!!errors.name}>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input
                        type="text"
                        id="name"
                        {...register('name', { required: 'name is required' })}
                    />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.rating}>
                    <FormLabel htmlFor="rating">Property rating</FormLabel>
                    <Controller
                        control={control}
                        name="rating"
                        defaultValue={0}
                        rules={{
                            required: 'Rating is required',
                            min: {
                                value: 1,
                                message: 'Rating has to be greater than 1',
                            },
                        }}
                        render={({ field }) => (
                            <ReactStars
                                count={5}
                                size={28}
                                half={false}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    <FormErrorMessage>{errors.rating?.message}</FormErrorMessage>
                </FormControl>
            </HStack>
            <HStack spacing={2} w="full">
                <FormControl isInvalid={!!errors.location}>
                    <FormLabel htmlFor="location">Location</FormLabel>
                    <Input
                        type="text"
                        id="location"
                        {...register('location', { required: 'Location is required' })}
                    />
                    <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.type}>
                    <FormLabel htmlFor="type">Type</FormLabel>
                    <Controller
                        control={control}
                        name="type"
                        rules={{ required: 'Type is required' }}
                        render={({ field }) => (
                            <RadioButtonGroup
                                options={['House', 'Apartments', 'Hotel']}
                                onSelect={(option) => {
                                    field.onChange(option);
                                }}
                            />
                        )}
                    />
                    <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
                </FormControl>
            </HStack>
            <FormControl isInvalid={!!errors.image_path}>
                <FormLabel htmlFor="location">Property image</FormLabel>
                {!image && (
                    <>
                        <Controller
                            control={control}
                            name="image_path"
                            rules={{ required: 'Image is required' }}
                            render={({ field }) => (
                                <FileDropzone
                                    fileService={fileService}
                                    setSelectedImage={(image_path) => {
                                        field.onChange(image_path);
                                        setImage(PropertyService.getPropertyImage(image_path));
                                    }}
                                />
                            )}
                        />
                        <FormErrorMessage>{errors.image_path?.message}</FormErrorMessage>
                    </>
                )}
            </FormControl>
            {image && (
                <VStack alignItems="flex-end" mt={2} w="full">
                    <ProgressiveImage
                        imageLink={image.url}
                        imageAlt="Property image"
                        width="full"
                        height="20rem"
                        borderRadius="md"
                    />
                    <Button
                        variant="solid"
                        colorScheme="red"
                        isLoading={loading}
                        leftIcon={<GiTrashCan />}
                        onClick={() => {
                            setLoading(true);
                            fileService
                                .deleteFiles([image.path])
                                .then(() => {
                                    notification.info(
                                        'Image deleted',
                                        'Image has been successfully deleted'
                                    );
                                    setImage(undefined);
                                })
                                .catch(() => {
                                    notification.error(
                                        'Could not delete image',
                                        'Please try again later'
                                    );
                                })
                                .finally(() => setLoading(false));
                        }}
                    >
                        Delete image
                    </Button>
                </VStack>
            )}
        </VStack>
    );
};

export default PropertyForm;
