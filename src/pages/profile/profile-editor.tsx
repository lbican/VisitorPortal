import React, { ReactElement } from 'react';
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { UserProfile } from '../../context/auth-context';

interface UserFormProps {
    userProfile: UserProfile | null;
    onSubmit: (data: Partial<UserProfile>) => void;
}

const UserForm: React.FC<UserFormProps> = ({ userProfile, onSubmit }): ReactElement => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<Partial<UserProfile>>();

    if (!userProfile) {
        return <p>bummer</p>;
    }
    const handleFormSubmit = (data: Partial<UserProfile>) => {
        onSubmit(data);
    };

    return (
        <Box justifyContent="flex-start">
            <VStack
                spacing={4}
                justifyContent="flex-start"
                as="form"
                onSubmit={handleSubmit(handleFormSubmit)}
            >
                <FormControl isInvalid={!!errors.username}>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input
                        type="text"
                        id="username"
                        defaultValue={userProfile.username || ''}
                        {...register('username', { required: 'Username is required' })}
                    />
                    <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.full_name}>
                    <FormLabel htmlFor="full_name">Full Name</FormLabel>
                    <Input
                        type="text"
                        id="full_name"
                        defaultValue={userProfile.full_name}
                        {...register('full_name', { required: 'Full Name is required' })}
                    />
                    <FormErrorMessage>{errors.full_name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.email}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                        type="email"
                        id="email"
                        defaultValue={userProfile.email}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: 'Invalid email format',
                            },
                        })}
                    />
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>

                <Button type="submit">Update</Button>
            </VStack>
        </Box>
    );
};

export default UserForm;
