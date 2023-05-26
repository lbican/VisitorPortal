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
import { TProperty } from '../../utils/interfaces/typings';
import FileDropzone from '../../components/common/file-dropzone';
import RadioButtonGroup from '../../components/common/radio-button-group';
import FileService, { IUploadedImage } from '../../services/file-service';
import { GiTrashCan } from 'react-icons/all';
import ProgressiveImage from '../../components/common/progressive-image';
import ReactStars from 'react-stars';

interface PropertyFormProps {
    property: TProperty | null;
    register: UseFormRegister<TProperty>;
    errors: FieldErrors<TProperty>;
    control: Control<TProperty>;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ register, errors, control }): ReactElement => {
    const [image, setImage] = useState<IUploadedImage | null>(null);
    const fileService = new FileService('property_images');

    return (
        <VStack spacing={4} justifyContent="flex-start">
            <FormControl isInvalid={!!errors.name}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                    type="text"
                    id="name"
                    {...register('name', { required: 'name is required' })}
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

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
                <FormControl>
                    <FormLabel htmlFor="location">Type</FormLabel>
                    <RadioButtonGroup
                        options={['House', 'Apartments', 'Hotel']}
                        onSelect={(option) => {
                            console.log(option);
                        }}
                    />
                </FormControl>
            </HStack>
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
                            size={36}
                            half={false}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <FormErrorMessage>{errors.rating?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.image_url}>
                <FormLabel htmlFor="location">Image</FormLabel>
                <Controller
                    control={control}
                    name="image_url"
                    rules={{ required: 'Image is required' }}
                    render={({ field }) => (
                        <FileDropzone
                            fileService={fileService}
                            setSelectedImage={(file) => {
                                field.onChange(file);
                                setImage(file);
                            }}
                            disabled={!!image}
                        />
                    )}
                />
                <FormErrorMessage>{errors.image_url?.message}</FormErrorMessage>
                {image && (
                    <VStack alignItems="flex-end" mt={2}>
                        <ProgressiveImage
                            imageLink={image.url}
                            imageAlt="Property image"
                            width="full"
                            height="20rem"
                        />
                        <Button
                            variant="solid"
                            colorScheme="red"
                            leftIcon={<GiTrashCan />}
                            onClick={() => {
                                fileService.deleteFiles([image.path]).then(() => {
                                    setImage(null);
                                });
                            }}
                        >
                            Delete image
                        </Button>
                    </VStack>
                )}
            </FormControl>
        </VStack>
    );
};

export default PropertyForm;
