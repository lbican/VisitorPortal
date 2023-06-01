import React, { ReactElement, useState } from 'react';
import {
    Divider,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    VStack,
} from '@chakra-ui/react';
import {
    Control,
    Controller,
    FieldErrors,
    UseFormRegister,
    UseFormSetValue,
} from 'react-hook-form';
import { PropertyType, TFormProperty } from '../../../utils/interfaces/typings';
import FileDropzone from '../../../components/common/input/file-dropzone';
import PropertyButtonGroup from '../../../components/common/input/property-button-group';
import FileService, { IUploadedImage } from '../../../services/file-service';
import ReactStars from 'react-stars';
import useToastNotification from '../../../hooks/useToastNotification';
import { useAuth } from '../../../context/auth-context';
import PropertyService from '../../../services/property-service';
import FormImage from '../../../components/property/form/form-image';
import { propertyStore } from '../../../mobx/propertyStore';

interface PropertyFormProps {
    register: UseFormRegister<TFormProperty>;
    errors: FieldErrors<TFormProperty>;
    control: Control<TFormProperty>;
    setValue: UseFormSetValue<TFormProperty>;
    existingPath?: string;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
    register,
    errors,
    control,
    setValue,
    existingPath,
}): ReactElement => {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<IUploadedImage | undefined>(
        PropertyService.getPropertyImage(existingPath)
    );
    const { user } = useAuth();
    const fileService = new FileService('property_images', user?.id);
    const notification = useToastNotification();

    const deletePropertyImage = () => {
        if (image) {
            setLoading(true);
            fileService
                .deleteFiles([image.path])
                .then(() => {
                    notification.info('Image deleted', 'Image has been successfully deleted');
                    setValue('image_path', '');
                    setImage(undefined);
                })
                .catch(() => {
                    notification.error('Could not delete image', 'Please try again later');
                })
                .finally(() => setLoading(false));
        }
    };

    return (
        <VStack spacing={4} justifyContent="flex-start">
            <HStack spacing={4} w="full">
                <FormControl isInvalid={!!errors.name}>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input
                        type="text"
                        id="name"
                        {...register('name', { required: 'name is required' })}
                    />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.location}>
                    <FormLabel htmlFor="location">Location</FormLabel>
                    <Input
                        type="text"
                        id="location"
                        {...register('location', { required: 'Location is required' })}
                    />
                    <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
                </FormControl>
            </HStack>
            <Divider />
            <HStack spacing={4} w="full">
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
                <FormControl isInvalid={!!errors.type}>
                    <FormLabel htmlFor="type">Type</FormLabel>
                    <Controller
                        control={control}
                        name="type"
                        rules={{ required: 'Type is required' }}
                        render={({ field }) => (
                            <PropertyButtonGroup
                                defaultValue={
                                    propertyStore.editingProperty?.type || PropertyType.APARTMENT
                                }
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
                {image ? (
                    <>
                        <FormHelperText>
                            Your property image, delete current image if you want to set a new one.
                        </FormHelperText>
                        <FormImage image={image} loading={loading} onClick={deletePropertyImage} />
                    </>
                ) : (
                    <Controller
                        control={control}
                        name="image_path"
                        rules={{ required: 'Image is required' }}
                        render={({ field }) => (
                            <FileDropzone
                                fileService={fileService}
                                setSelectedImage={(image_path) => {
                                    setImage(PropertyService.getPropertyImage(image_path));
                                    field.onChange(image_path);
                                }}
                            />
                        )}
                    />
                )}
                <FormErrorMessage>{errors.image_path?.message}</FormErrorMessage>
            </FormControl>
        </VStack>
    );
};

export default PropertyForm;
