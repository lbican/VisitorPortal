import React, { useContext, useState } from 'react';
import { Avatar, Box, Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { StepActions } from '../definition/form-state';
import { FormContext } from '../definition/form-context';
import { IUserRegistration } from '../../../../utils/interfaces/typings';
import { motion } from 'framer-motion';
import { AuthError } from '@supabase/supabase-js';
import AnimatedAlert from '../../../../components/common/feedback/animated-alert';
import { AuthService } from '../../../../services/auth-service';
import { useTranslation } from 'react-i18next';

const AccountComplete: React.FC<StepActions> = ({ prevStep }) => {
    const form = useContext(FormContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<AuthError | null>(null);
    const { t } = useTranslation();

    const user: IUserRegistration = {
        username: form?.formState.steps.account.value.username ?? '',
        first_name: form?.formState.steps.account.value.first_name ?? '',
        last_name: form?.formState.steps.account.value.last_name ?? '',
        avatar: form?.formState.steps.account.value.avatar ?? '',
        email: form?.formState.steps.security.value.email ?? '',
        password: form?.formState.steps.security.value.password ?? '',
        repeat_password: form?.formState.steps.security.value.password ?? '',
    };

    const signUpUser = async (user: IUserRegistration) => {
        setLoading(true);
        setError(null);

        try {
            await AuthService.signUpUser(user);
        } catch (error) {
            const authError = error as AuthError;
            setError(authError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box py={6}>
                <Flex py={6} gap={4}>
                    <Avatar size="2xl" src={user.avatar}></Avatar>
                    <VStack alignItems="flex-start">
                        <Heading size="sm">
                            {t('Hey')} {user.first_name},
                        </Heading>
                        <Text align="left">{t('Good to have you on board!')}</Text>
                        <Heading size="sm">{t('Your details:')}</Heading>
                        <Text fontSize="sm">
                            <Text as="b">{t('Username:')} </Text> {user.username}
                        </Text>
                        <Text fontSize="sm">
                            <Text as="b">{t('Full name:')} </Text>
                            {user.first_name + ' ' + user.last_name}
                        </Text>
                        <Text fontSize="sm">
                            <Text as="b">{t('Email:')} </Text>
                            {user.email}
                        </Text>
                    </VStack>
                </Flex>

                <HStack spacing={2} width="100%" justifyContent="flex-end" my={6}>
                    <Button size="sm" onClick={prevStep}>
                        {t('Previous')}
                    </Button>
                    <Button
                        isLoading={loading}
                        onClick={() => signUpUser(user)}
                        as={motion.button}
                        whileHover={{
                            scale: 1.05,
                        }}
                        size="sm"
                        type="submit"
                        bgColor="green.500"
                    >
                        {t('Finish registration')}
                    </Button>
                </HStack>
                <AnimatedAlert error={error} />
            </Box>
        </>
    );
};

export default AccountComplete;
