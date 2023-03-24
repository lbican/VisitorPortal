import React, { useContext } from 'react';
import { Avatar, Box, Button, Flex } from '@chakra-ui/react';
import { StepActions } from '../definition/form-state';
import { FormContext } from '../definition/form-context';
import { User } from '../../../../utils/interfaces/typings';

const AccountComplete: React.FC<StepActions> = ({ prevStep }) => {
  const form = useContext(FormContext);

  const user: User = {
    first_name: form?.formState.steps.account.value.first_name,
    last_name: form?.formState.steps.account.value.last_name,
    avatar: form?.formState.steps.account.value.avatar,
    email: form?.formState.steps.security.value.email,
    password: form?.formState.steps.security.value.password,
    repeat_password: form?.formState.steps.security.value.repeat_password,
  };

  return (
    <Box py={6}>
      <Flex p={6}>
        <Avatar size="2xl" src={user.avatar}></Avatar>
      </Flex>

      <Flex width="100%" justifyContent="flex-end" my={6}>
        <Button onClick={prevStep}>Previous</Button>
      </Flex>
    </Box>
  );
};

export default AccountComplete;
