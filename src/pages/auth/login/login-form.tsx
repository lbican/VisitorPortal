import React, { ReactElement, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Text,
    VStack,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import { AuthError, Provider } from '@supabase/supabase-js';
import supabase from '../../../../database';
import { ThemeTypings } from '@chakra-ui/styled-system';
import { useForm } from 'react-hook-form';
import AnimatedAlert from '../../../components/layout/animated-alert';
import { useNavigate } from 'react-router-dom';

interface OAuthProvider {
    name: string;
    colorScheme: ThemeTypings['colorSchemes'];
    provider: Provider;
    icon: ReactElement;
}

const LoginForm = (): ReactElement => {
    const [error, setError] = useState<AuthError | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const oAuthProviders: OAuthProvider[] = [
        { name: 'Google', provider: 'google', icon: <FcGoogle />, colorScheme: 'gray' },
        { name: 'Facebook', provider: 'facebook', icon: <FaFacebook />, colorScheme: 'facebook' },
        { name: 'Twitter', provider: 'twitter', icon: <FaTwitter />, colorScheme: 'twitter' },
    ];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        shouldUseNativeValidation: false,
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { ref: emailRef, ...emailControl } = register('email', {
        required: 'Email is required',
    });
    const { ref: passwordRef, ...passwordControl } = register('password', {
        required: 'Password is required',
    });

    const jwtLogin = async (provider: Provider) => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                queryParams: {
                    prompt: 'consent',
                },
            },
        });

        if (error) {
            console.error(error);
            setError(error);
        }
    };

    const emailLogin = async (email: string, password: string) => {
        setError(null);
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error(error);
            throw error;
        }

        if (data) {
            setLoading(false);
            navigate('/');
        }
    };

    return (
        <>
            <VStack
                spacing={6}
                as="form"
                onSubmit={handleSubmit((value) => {
                    emailLogin(value.email, value.password).catch((error) => {
                        setLoading(false);
                        setError(error);
                    });
                })}
            >
                <FormControl id="email" isInvalid={!!errors.email}>
                    <FormLabel>Email address</FormLabel>
                    <Input type="email" ref={emailRef} {...emailControl} />
                    <FormErrorMessage>{errors.email?.message?.toString()}</FormErrorMessage>
                </FormControl>
                <FormControl id="password" isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" ref={passwordRef} {...passwordControl} />
                    <FormErrorMessage>{errors.password?.message?.toString()}</FormErrorMessage>
                </FormControl>
                <Button
                    isLoading={loading}
                    alignSelf="flex-end"
                    backgroundColor="green.500"
                    variant="solid"
                    type="submit"
                >
                    Sign in
                </Button>
                <AnimatedAlert error={error} />
            </VStack>
            <VStack spacing={6}>
                <Flex align="center" w="full">
                    <Divider />
                    <Text padding="2">OR</Text>
                    <Divider />
                </Flex>
                <ButtonGroup spacing={2}>
                    {oAuthProviders.map((oauth) => {
                        return (
                            <Button
                                minWidth="33%"
                                key={oauth.provider}
                                colorScheme={oauth.colorScheme}
                                onClick={() => jwtLogin(oauth.provider)}
                                leftIcon={oauth.icon}
                            >
                                {oauth.name}
                            </Button>
                        );
                    })}
                </ButtonGroup>
            </VStack>
        </>
    );
};

export default LoginForm;
