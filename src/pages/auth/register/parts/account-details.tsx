import React, { useCallback, useContext, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
} from '@chakra-ui/react';
import { StepActions } from '../definition/form-state';
import { FormContext } from '../definition/form-context';
import { useForm } from 'react-hook-form';
import { produce } from 'immer';
import PictureSelector from './picture-selector';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AccountDetails: React.FC<StepActions> = ({ nextStep }) => {
    const form = useContext(FormContext);
    const [avatar, setAvatar] = useState<string>(form?.formState.steps.account.value.avatar ?? '');
    const { t } = useTranslation();
    const USERNAME_MIN = 6;
    const NAME_MIN = 2;

    const handleImageClick = useCallback((image: string) => {
        setAvatar(image);
    }, []);

    const {
        setValue,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        shouldUseNativeValidation: false,
        defaultValues: {
            username: form?.formState.steps.account.value.username ?? '',
            first_name: form?.formState.steps.account.value.first_name ?? '',
            last_name: form?.formState.steps.account.value.last_name ?? '',
            avatar: form?.formState.steps.account.value.avatar ?? '',
        },
    });

    const { ref: usernameRef, ...usernameControl } = register('username', {
        required: t('Username is required'),
        minLength: {
            value: USERNAME_MIN,
            message: t(`Username must be at least ${USERNAME_MIN} characters`),
        },
    });
    const { ref: firstNameRef, ...firstNameControl } = register('first_name', {
        minLength: {
            value: NAME_MIN,
            message: t(`First name must be at least ${NAME_MIN} characters`),
        },
        required: t('First name is required'),
    });
    const { ref: lastNameRef, ...lastNameControl } = register('last_name', {
        minLength: {
            value: NAME_MIN,
            message: t(`Last name must be at least ${NAME_MIN} characters`),
        },
        required: t('Last name is required'),
    });

    return (
        <>
            <Box
                py={6}
                as="form"
                onSubmit={handleSubmit((value) => {
                    form?.setFormState(
                        produce((state) => {
                            state.steps.account = {
                                valid: true,
                                value,
                            };
                        })
                    );

                    nextStep();
                })}
            >
                <FormControl isInvalid={!!errors.username}>
                    <FormLabel htmlFor="username" fontWeight="normal">
                        {t('Username')}
                    </FormLabel>
                    <Input
                        id="username"
                        placeholder={t('Username') ?? ''}
                        ref={usernameRef}
                        {...usernameControl}
                    />
                    <FormErrorMessage>{errors.username?.message?.toString()}</FormErrorMessage>
                </FormControl>

                <Flex mt="5%">
                    <FormControl mr="5%" isInvalid={!!errors.first_name}>
                        <FormLabel htmlFor="first-name" fontWeight="normal">
                            {t('First name')}
                        </FormLabel>
                        <Input
                            id="first-name"
                            placeholder={t('First name') ?? ''}
                            ref={firstNameRef}
                            {...firstNameControl}
                        />
                        <FormErrorMessage>
                            {errors.first_name?.message?.toString()}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.last_name}>
                        <FormLabel htmlFor="last_name" fontWeight="normal">
                            {t('Last name')}
                        </FormLabel>
                        <Input
                            id="last_name"
                            placeholder={t('Last name') ?? ''}
                            ref={lastNameRef}
                            {...lastNameControl}
                        />
                        <FormErrorMessage>{errors.last_name?.message?.toString()}</FormErrorMessage>
                    </FormControl>
                </Flex>
                <Flex mt="5%">
                    <Avatar size="2xl" src={avatar} />
                    <PictureSelector
                        onSelect={(url) => {
                            setValue('avatar', url);
                            handleImageClick(url);
                        }}
                    />
                </Flex>
                <Flex width="100%" justifyContent="flex-end" my={6}>
                    <Button size="sm" type="submit">
                        {t('Next')}
                    </Button>
                </Flex>
            </Box>
        </>
    );
};

export default AccountDetails;
