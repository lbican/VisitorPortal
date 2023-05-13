import React, { useEffect, useState } from 'react';
import SplitScreen from '../../../components/split-screen';
import { Button, FormControl, FormErrorMessage, FormLabel, Input, VStack } from '@chakra-ui/react';
import AnimatedAlert from '../../../components/layout/animated-alert';
import { AuthError } from '@supabase/supabase-js';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../context/auth-context';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserService } from '../../../services/user-service';
const UsernamePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const USERNAME_MIN = 6;
    const USERNAME_MAX = 30;

    const [error, setError] = useState<AuthError | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { user } = useAuth();
    const redirectTo = location.state?.from || '/';

    useEffect(() => {
        if (user && user.username) {
            navigate(redirectTo, {
                replace: true,
            });
        }
    }, [user]);

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

    const saveUsername = (username: string) => {
        setError(null);
        setLoading(true);

        UserService.updateUserProfile(user?.id, { username: username })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
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
                        saveUsername(value.username);
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
                        colorScheme="blue"
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
