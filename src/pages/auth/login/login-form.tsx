import React, { ReactElement } from 'react';
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
import { Provider } from '@supabase/supabase-js';
import { ThemeTypings } from '@chakra-ui/styled-system';
import { useForm } from 'react-hook-form';
import AnimatedAlert from '../../../components/layout/animated-alert';
import { emailValidator, passwordValidator } from '../../../services/validators';
import { useAuthForm } from '../../../hooks/useAuthLogin';

interface OAuthProvider {
    name: string;
    colorScheme: ThemeTypings['colorSchemes'];
    provider: Provider;
    icon: ReactElement;
}

const LoginForm = (): ReactElement => {
    const { loginUserWithToken, loginUserWithEmail, error, loading } = useAuthForm();

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

    const { ref: emailRef, ...emailControl } = register('email', emailValidator);
    const { ref: passwordRef, ...passwordControl } = register('password', passwordValidator);

    return (
        <>
            <VStack
                spacing={6}
                as="form"
                onSubmit={handleSubmit(async (value) => {
                    await loginUserWithEmail(value.email, value.password);
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
                                onClick={() => loginUserWithToken(oauth.provider)}
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
