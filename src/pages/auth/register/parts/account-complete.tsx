import React, { useContext, useState } from 'react';
import { Avatar, Box, Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { StepActions } from '../definition/form-state';
import { FormContext } from '../definition/form-context';
import { UserRegistration } from '../../../../utils/interfaces/typings';
import { motion } from 'framer-motion';
import supabase from '../../../../../database';
import _ from 'lodash';
import { AuthError } from '@supabase/supabase-js';
import AnimatedAlert from '../../../../components/layout/animated-alert';

const AccountComplete: React.FC<StepActions> = ({ prevStep, nextStep }) => {
    const form = useContext(FormContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<AuthError | null>(null);

    const user: UserRegistration = {
        username: _.get(form, 'formState.steps.account.value.username', ''),
        first_name: _.get(form, 'formState.steps.account.value.first_name', ''),
        last_name: _.get(form, 'formState.steps.account.value.last_name', ''),
        avatar: _.get(form, 'formState.steps.account.value.avatar', ''),
        email: _.get(form, 'formState.steps.security.value.email', ''),
        password: _.get(form, 'formState.steps.security.value.password', ''),
        repeat_password: _.get(form, 'formState.steps.security.value.password', ''),
    };

    const signUpUser = async (user: UserRegistration) => {
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
                data: {
                    full_name: user.first_name + ' ' + user.last_name,
                    username: user.username,
                    avatar_url: user.avatar,
                },
            },
        });

        if (!error) {
            nextStep();
        } else {
            setError(error);
        }

        setLoading(false);
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
