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
    Link,
    Text,
    VStack,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import { Provider } from '@supabase/supabase-js';
import { ThemeTypings } from '@chakra-ui/styled-system';
import { useForm } from 'react-hook-form';
import AnimatedAlert from '../../../components/common/feedback/animated-alert';
import { emailValidator, passwordValidator } from '../../../services/validators';
import { useAuthForm } from '../../../hooks/useAuthLogin';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface OAuthProvider {
    name: string;
    colorScheme: ThemeTypings['colorSchemes'];
    provider: Provider;
    icon: ReactElement;
}

const LoginForm = (): ReactElement => {
    const { loginUserWithToken, loginUserWithEmail, error, loading } = useAuthForm();
    const { t } = useTranslation();

    const oAuthProviders: OAuthProvider[] = [
        { name: 'Google', provider: 'google', icon: <FcGoogle />, colorScheme: 'gray' },
        {
            name: 'Facebook',
            provider: 'facebook',
            icon: <FaFacebook />,
            colorScheme: 'facebook',
        },
        {
            name: 'Twitter',
            provider: 'twitter',
            icon: <FaTwitter />,
            colorScheme: 'twitter',
        },
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

    const onLoginSubmit = async (value: { email: string; password: string }) => {
        await loginUserWithEmail(value.email, value.password);
    };

    return (
        <>
            <VStack spacing={6} as="form" onSubmit={handleSubmit(onLoginSubmit)}>
                <FormControl id="email" isInvalid={!!errors.email}>
                    <FormLabel>{t('Email address')}</FormLabel>
                    <Input type="email" ref={emailRef} {...emailControl} />
                    <FormErrorMessage>{errors.email?.message?.toString()}</FormErrorMessage>
                </FormControl>
                <FormControl id="password" isInvalid={!!errors.password}>
                    <FormLabel>{t('Password')}</FormLabel>
                    <Input type="password" ref={passwordRef} {...passwordControl} />
                    <FormErrorMessage>{errors.password?.message?.toString()}</FormErrorMessage>
                </FormControl>
                <Link as={NavLink} to="/register" alignSelf="flex-end">
                    {t("Don't have an account? Register")}
                </Link>
                <Button
                    isLoading={loading}
                    colorScheme="blue"
                    alignSelf="flex-end"
                    variant="solid"
                    type="submit"
                >
                    {t('Sign in')}
                </Button>
                <AnimatedAlert error={error} />
            </VStack>
            <VStack spacing={6}>
                <Flex align="center" w="full">
                    <Divider />
                    <Text padding="2">{t('OR')}</Text>
                    <Divider />
                </Flex>
                <ButtonGroup spacing={2}>
                    {oAuthProviders.map((oauth) => {
                        return (
                            <Button
                                minWidth="33%"
                                key={oauth.provider}
                                colorScheme={oauth.colorScheme}
                                onClick={() => void loginUserWithToken(oauth.provider)}
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
