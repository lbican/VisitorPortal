import React, { ReactElement } from 'react';
import {
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Link,
    Stack,
    VStack,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { SignInWithOAuthCredentials } from '@supabase/supabase-js';
import supabase from '../../../../database';

const LoginForm = (): ReactElement => {
    const jwtLogin = async (provider: string) => {
        await supabase.auth
            .signInWithOAuth({
                provider: provider,
            } as SignInWithOAuthCredentials)
            .catch((error) => console.error(error));
    };

    return (
        <>
            <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" />
            </FormControl>
            <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" />
            </FormControl>
            <VStack spacing={6}>
                <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align={'start'}
                    justify={'space-between'}
                >
                    <Checkbox colorScheme={'green'}>Remember me</Checkbox>
                    <Link color={'green.500'}>Forgot password?</Link>
                </Stack>
                <Button alignSelf={'flex-end'} backgroundColor={'green.500'} variant={'solid'}>
                    Sign in
                </Button>
                <Divider />
                <HStack>
                    <Button
                        bgColor={'white'}
                        onClick={() => jwtLogin('google')}
                        color={'black'}
                        leftIcon={<FcGoogle />}
                    >
                        Google
                    </Button>
                </HStack>
            </VStack>
        </>
    );
};

export default LoginForm;
