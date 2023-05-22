import React, { useContext, useState } from 'react';
import { Avatar, Box, Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { StepActions } from '../definition/form-state';
import { FormContext } from '../definition/form-context';
import { IUserRegistration } from '../../../../utils/interfaces/typings';
import { motion } from 'framer-motion';
import { AuthError } from '@supabase/supabase-js';
import AnimatedAlert from '../../../../components/layout/animated-alert';
import { AuthService } from '../../../../services/auth-service';

const AccountComplete: React.FC<StepActions> = ({ prevStep, nextStep }) => {
    const form = useContext(FormContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<AuthError | null>(null);

    const user: IUserRegistration = {
        username: form?.formState.steps.account.value.username || '',
        first_name: form?.formState.steps.account.value.first_name || '',
        last_name: form?.formState.steps.account.value.last_name || '',
        avatar: form?.formState.steps.account.value.avatar || '',
        email: form?.formState.steps.security.value.email || '',
        password: form?.formState.steps.security.value.password || '',
        repeat_password: form?.formState.steps.security.value.password || '',
    };

    const signUpUser = async (user: IUserRegistration) => {
        setLoading(true);
        setError(null);

        try {
            await AuthService.signUpUser(user);
            nextStep();
        } catch (error) {
            setError(error as AuthError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Box py={6}>
                <Flex py={6} gap={4}>
                    <Avatar size="2xl" src={user.avatar}></Avatar>
                    <VStack alignItems="flex-start">
                        <Heading size="sm">Hey {user.first_name},</Heading>
                        <Text align="left">Good to have you on board!</Text>
                        <Heading size="sm">Your details:</Heading>
                        <Text fontSize="sm">
                            <Text as="b">Username: </Text> {user.username}
                        </Text>
                        <Text fontSize="sm">
                            <Text as="b">Full name: </Text>
                            {user.first_name + ' ' + user.last_name}
                        </Text>
                        <Text fontSize="sm">
                            <Text as="b">Email: </Text>
                            {user.email}
                        </Text>
                    </VStack>
                </Flex>

                <HStack spacing={2} width="100%" justifyContent="flex-end" my={6}>
                    <Button size="sm" onClick={prevStep}>
                        Previous
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
                        Finish registration
                    </Button>
                </HStack>
                <AnimatedAlert error={error} />
            </Box>
        </motion.div>
    );
};

export default AccountComplete;
