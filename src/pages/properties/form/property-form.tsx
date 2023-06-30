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
import CustomButtonGroup, {
    RadioCardOptions,
} from '../../../components/common/input/custom-button-group';
import FileService, { IUploadedImage } from '../../../services/file-service';
import ReactStars from 'react-stars';
import useToastNotification from '../../../hooks/useToastNotification';
import { useAuth } from '../../../context/auth-context';
import PropertyService from '../../../services/property-service';
import FormImage from '../../../components/property/form/form-image';
import { propertyStore } from '../../../mobx/propertyStore';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';
import FormMap from '../../../components/form/form-map';
import { useTranslation } from 'react-i18next';
import { MdOutlineApartment, MdOutlineHotel, MdOutlineHouse } from 'react-icons/md';

interface PropertyFormProps {
    register: UseFormRegister<TFormProperty>;
    errors: FieldErrors<TFormProperty>;
    control: Control<TFormProperty>;
    setValue: UseFormSetValue<TFormProperty>;
    watch: UseFormWatch<TFormProperty>;
    activeStep: number;
}

const options: RadioCardOptions[] = [
    {
        value: PropertyType.APARTMENT,
        icon: <MdOutlineHotel />,
        colorScheme: 'yellow',
    },
    {
        value: PropertyType.HOTEL,
        icon: <MdOutlineApartment />,
        colorScheme: 'red',
    },
    {
        value: PropertyType.HOUSE,
        icon: <MdOutlineHouse />,
        colorScheme: 'green',
    },
];

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
    const { t } = useTranslation();

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
                    notification.info(
                        t('Image has been successfully deleted'),
                        t('Image deleted') ?? ''
                    );
                    setValue('image_path', '');
                    setImage(undefined);
                })
                .catch(() => {
                    notification.error(t('Could not delete image, please try again later'));
                })
                .finally(() => setLoading(false));
        }
    };

    return (
        <VStack
            spacing={4}
            justifyContent="flex-start"
            alignItems="flex-start"
            ml={2}
            maxWidth="64%"
        >
            {activeStep === 0 && (
                <VStack spacing={4}>
                    <HStack spacing={4} w="full">
                        <FormControl isInvalid={!!errors.name}>
                            <FormLabel htmlFor="name">{t('Name')}</FormLabel>
                            <Input
                                isInvalid={!!errors.name}
                                type="text"
                                id="name"
                                {...register('name', {
                                    required: t('Name is required') ?? true,
                                })}
                            />
                            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.location}>
                            <FormLabel htmlFor="location">{t('Location')}</FormLabel>
                            <Input
                                isInvalid={!!errors.location}
                                type="text"
                                id="location"
                                {...register('location', {
                                    required: t('Location is required') ?? true,
                                })}
                            />
                            <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
                        </FormControl>
                    </HStack>
                    <FormMap
                        onLocationChange={(location) => {
                            setValue('location', location);
                        }}
                        locationName={watch().location}
                    />
                </VStack>
            )}
            {activeStep === 1 && (
                <VStack alignItems="flex-start" spacing={4} w="full" mt={4} ml={2}>
                    <FormControl isInvalid={!!errors.type}>
                        <FormLabel htmlFor="type">{t('Type')}</FormLabel>
                        <Controller
                            control={control}
                            name="type"
                            rules={{ required: t('Type is required') ?? true }}
                            render={({ field }) => (
                                <CustomButtonGroup
                                    options={options}
                                    defaultValue={
                                        propertyStore.editingProperty?.type ??
                                        PropertyType.APARTMENT
                                    }
                                    onSelect={(option) => {
                                        field.onChange(option as PropertyType);
                                    }}
                                />
                            )}
                        />
                        <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.rating}>
                        <FormLabel htmlFor="rating">{t('Property rating')}</FormLabel>
                        <Controller
                            control={control}
                            name="rating"
                            defaultValue={0}
                            rules={{
                                required: t('Rating is required') ?? true,
                                min: {
                                    value: 1,
                                    message: t('Rating has to be greater than 1'),
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
            )}
            {activeStep === 2 && (
                <VStack spacing={4} justifyContent="flex-start" mt={4}>
                    <FormControl isInvalid={!!errors.image_path}>
                        <FormLabel htmlFor="location">{t('Property image')}</FormLabel>
                        {image ? (
                            <>
                                <FormHelperText>
                                    {t(
                                        'Your property image, delete current image if you want to set a new one.'
                                    )}
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
                                rules={{ required: t('Image is required') ?? true }}
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
            )}
            {activeStep === 3 && (
                <VStack spacing={4} mt={4}>
                    {fields.map((field, index) => (
                        <HStack key={field.id} w="full">
                            <FormControl isInvalid={!!errors.units && !!errors.units[index]?.name}>
                                <FormLabel htmlFor={`unit_name_${index}`}>
                                    {t('Unit name')}
                                </FormLabel>
                                <Input
                                    type="text"
                                    id={`unit_name_${index}`}
                                    {...register(`units.${index}.name`, {
                                        required: t('Name is required') ?? true,
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.units?.[index]?.name?.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor={`capacity_${index}`}>
                                    {t('Unit capacity')}
                                </FormLabel>
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
                        {t('Add unit')}
                    </Button>
                </VStack>
            )}
        </VStack>
    );
};

export default PropertyForm;
