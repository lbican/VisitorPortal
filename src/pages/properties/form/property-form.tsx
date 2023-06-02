import React, { ReactElement, useState } from 'react';
import {
    Button,
    Divider,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    HStack,
    IconButton,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    VStack,
} from '@chakra-ui/react';
import { Steps, Step } from 'chakra-ui-steps';
import {
    Control,
    Controller,
    FieldErrors,
    useFieldArray,
    UseFormRegister,
    UseFormSetValue,
    UseFormWatch,
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
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';

interface PropertyFormProps {
    register: UseFormRegister<TFormProperty>;
    errors: FieldErrors<TFormProperty>;
    control: Control<TFormProperty>;
    setValue: UseFormSetValue<TFormProperty>;
    watch: UseFormWatch<TFormProperty>;
    activeStep: number;
}
const PropertyForm: React.FC<PropertyFormProps> = ({
    register,
    errors,
    control,
    setValue,
    watch,
    activeStep,
}): ReactElement => {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<IUploadedImage | undefined>(
        PropertyService.getPropertyImage(watch().image_path)
    );
    const { user } = useAuth();
    const fileService = new FileService('property_images', user?.id);
    const notification = useToastNotification();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'units',
    });

    const addUnit = () => append({ id: uuidv4(), name: '', capacity: 1 });

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
        <Steps activeStep={activeStep} colorScheme="teal" size="lg" orientation="vertical">
            <Step label="Basic Information">
                <VStack spacing={4} justifyContent="flex-start" mt={4}>
                    <HStack spacing={4} w="full">
                        <FormControl isInvalid={!!errors.name}>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <Input
                                isInvalid={!!errors.name}
                                type="text"
                                id="name"
                                {...register('name', { required: 'Name is required' })}
                            />
                            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.location}>
                            <FormLabel htmlFor="location">Location</FormLabel>
                            <Input
                                isInvalid={!!errors.location}
                                type="text"
                                id="location"
                                {...register('location', { required: 'Location is required' })}
                            />
                            <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
                        </FormControl>
                    </HStack>
                </VStack>
            </Step>
            <Step label="Rating & Type">
                <VStack justifyContent="center" spacing={4} w="full" mt={4} ml={2}>
                    <FormControl isInvalid={!!errors.type}>
                        <FormLabel htmlFor="type">Type</FormLabel>
                        <Controller
                            control={control}
                            name="type"
                            rules={{ required: 'Type is required' }}
                            render={({ field }) => (
                                <PropertyButtonGroup
                                    defaultValue={
                                        propertyStore.editingProperty?.type ||
                                        PropertyType.APARTMENT
                                    }
                                    onSelect={(option) => {
                                        field.onChange(option);
                                    }}
                                />
                            )}
                        />
                        <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
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
                </VStack>
            </Step>
            <Step label="Image">
                <VStack spacing={4} justifyContent="flex-start" mt={4}>
                    <FormControl isInvalid={!!errors.image_path}>
                        <FormLabel htmlFor="location">Property image</FormLabel>
                        {image ? (
                            <>
                                <FormHelperText>
                                    Your property image, delete current image if you want to set a
                                    new one.
                                </FormHelperText>
                                <FormImage
                                    image={image}
                                    loading={loading}
                                    onClick={deletePropertyImage}
                                />
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
            </Step>
            <Step label="Units">
                <VStack spacing={4} mt={4}>
                    {fields.map((field, index) => (
                        <HStack key={field.id} w="full">
                            <FormControl isInvalid={!!errors.units && !!errors.units[index]?.name}>
                                <FormLabel htmlFor={`unit_name_${index}`}>Unit name</FormLabel>
                                <Input
                                    type="text"
                                    id={`unit_name_${index}`}
                                    {...register(`units.${index}.name`, {
                                        required: 'Name is required',
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.units && errors.units[index]?.name?.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor={`capacity_${index}`}>Unit capacity</FormLabel>
                                <NumberInput
                                    id={`capacity_${index}`}
                                    min={1}
                                    max={16}
                                    keepWithinRange={true}
                                >
                                    <NumberInputField {...register(`units.${index}.capacity`)} />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>
                                    {errors.units && errors.units[index]?.message}
                                </FormErrorMessage>
                            </FormControl>
                            <Divider orientation="vertical" w="2px" height="5rem" />
                            <IconButton
                                colorScheme="red"
                                aria-label="Remove Unit"
                                icon={<AiOutlineMinus />}
                                onClick={() => remove(index)}
                            />
                        </HStack>
                    ))}
                    <Button
                        alignSelf="flex-end"
                        colorScheme="blue"
                        aria-label="Add new Unit"
                        leftIcon={<AiOutlinePlus />}
                        onClick={addUnit}
                    >
                        Add unit
                    </Button>
                </VStack>
            </Step>
        </Steps>
    );
};

export default PropertyForm;
