import React, { useState } from 'react';
import SplitScreen from '../../../components/split-screen';
import { Button, FormControl, FormErrorMessage, FormLabel, Input, VStack } from '@chakra-ui/react';
import AnimatedAlert from '../../../components/layout/animated-alert';
import { AuthError } from '@supabase/supabase-js';
import { useForm } from 'react-hook-form';
import supabase from '../../../../database';
import { useAuth } from '../../../context/auth-context';
const UsernamePage: React.FC = () => {
    const USERNAME_MIN = 6;
    const USERNAME_MAX = 30;

    const [error, setError] = useState<AuthError | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        shouldUseNativeValidation: false,
        defaultValues: {
            username: '',
        },
    });

    const { ref: usernameRef, ...usernameControl } = register('username', {
        required: 'Username is required',
        minLength: {
            value: USERNAME_MIN,
            message: `Username should be at least ${USERNAME_MIN} characters long`,
        },
        maxLength: {
            value: USERNAME_MAX,
            message: `Username should not be more than ${USERNAME_MAX} characters`,
        },
    });

    const saveUsername = async (username: string) => {
        setError(null);
        setLoading(true);

        const { error } = await supabase
            .from('Profiles')
            .update({ username: username })
            .eq('id', user?.id);

        if (error) {
            console.error(error);
            throw error;
        }

        setLoading(false);
    };

    return (
        <SplitScreen
            imageLink="https://source.unsplash.com/1600x900/?croatia"
            title="One last thing"
        >
            return (
            <>
                <VStack
                    spacing={6}
                    as="form"
                    onSubmit={handleSubmit((value) => {
                        saveUsername(value.username).catch((error) => {
                            setError(error);
                        });
                    })}
                >
                    <FormControl id="username" isInvalid={!!errors.username}>
                        <FormLabel>Pick your username:</FormLabel>
                        <Input type="text" ref={usernameRef} {...usernameControl} />
                        <FormErrorMessage>{errors.username?.message?.toString()}</FormErrorMessage>
                    </FormControl>
                    <Button
                        isLoading={loading}
                        alignSelf="flex-end"
                        backgroundColor="green.500"
                        variant="solid"
                        type="submit"
                    >
                        Save username
                    </Button>
                    <AnimatedAlert error={error} />
                </VStack>
            </>
            );
        </SplitScreen>
    );
};

export default UsernamePage;
