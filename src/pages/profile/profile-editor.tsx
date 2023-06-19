import React, { ReactElement } from 'react';
import { FormControl, FormErrorMessage, FormLabel, Input, VStack } from '@chakra-ui/react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { UserProfile } from '../../context/auth-context';
import { useTranslation } from 'react-i18next';

interface UserFormProps {
    userProfile: UserProfile | null;
    register: UseFormRegister<Partial<UserProfile>>;
    errors: FieldErrors<Partial<UserProfile>>;
}

const ProfileEditor: React.FC<UserFormProps> = ({
    userProfile,
    register,
    errors,
}): ReactElement => {
    const { t } = useTranslation();
    if (!userProfile) {
        return <p>bummer</p>;
    }

    return (
        <VStack spacing={4} justifyContent="flex-start">
            <FormControl isInvalid={!!errors.username}>
                <FormLabel htmlFor="username">{t('Username')}</FormLabel>
                <Input
                    type="text"
                    id="username"
                    defaultValue={userProfile.username ?? ''}
                    {...register('username', {
                        required: t('Username is required') ?? true,
                    })}
                />
                <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.full_name}>
                <FormLabel htmlFor="full_name">{t('Full Name')}</FormLabel>
                <Input
                    type="text"
                    id="full_name"
                    defaultValue={userProfile.full_name}
                    {...register('full_name', {
                        required: t('Full Name is required') ?? '',
                    })}
                />
                <FormErrorMessage>{errors.full_name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">{t('Email address')}</FormLabel>
                <Input
                    type="email"
                    id="email"
                    defaultValue={userProfile.email}
                    {...register('email', {
                        required: t('Email is required') ?? true,
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: t('Invalid email format') ?? '',
                        },
                    })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
        </VStack>
    );
};

export default ProfileEditor;
