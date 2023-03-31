import React, { useContext, useState } from 'react';
import { Avatar, Box, Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { StepActions } from '../definition/form-state';
import { FormContext } from '../definition/form-context';
import { UserRegistration } from '../../../../utils/interfaces/typings';
import { motion } from 'framer-motion';
import supabase from '../../../../../database';

const AccountComplete: React.FC<StepActions> = ({ prevStep }) => {
  const form = useContext(FormContext);
  const [loading, setLoading] = useState(false);

  const user: UserRegistration = {
    username: form?.formState.steps.account.value.username || '',
    first_name: form?.formState.steps.account.value.first_name || '',
    last_name: form?.formState.steps.account.value.last_name || '',
    avatar: form?.formState.steps.account.value.avatar || '',
    email: form?.formState.steps.security.value.email || '',
    password: form?.formState.steps.security.value.password || '',
    repeat_password: form?.formState.steps.security.value.repeat_password || '',
  };

  const signUpUser = async (user: UserRegistration) => {
    setLoading(true);
    await supabase.auth
      .signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.first_name + ' ' + user.last_name,
            username: user.username,
            avatar: user.avatar,
          },
        },
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box py={6}>
      <Flex py={6} gap={4}>
        <Avatar size="2xl" src={user.avatar}></Avatar>
        <VStack alignItems={'flex-start'}>
          <Heading size={'sm'}>Hey {user.first_name},</Heading>
          <Text align={'left'}>Good to have you on board!</Text>
          <Heading size={'sm'}>Your details:</Heading>
          <Text fontSize={'sm'}>
            <Text as={'b'}>Username: </Text> {user.username}
          </Text>
          <Text fontSize={'sm'}>
            <Text as={'b'}>Full name: </Text>
            {user.first_name + ' ' + user.last_name}
          </Text>
          <Text fontSize={'sm'}>
            <Text as={'b'}>Email: </Text>
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
          bgColor={'green.500'}
        >
          Finish registration
        </Button>
      </HStack>
    </Box>
  );
};

export default AccountComplete;
