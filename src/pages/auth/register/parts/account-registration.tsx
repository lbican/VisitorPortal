import React, { useContext } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { StepActions } from '../definition/form-state';
import { FormContext } from '../definition/form-context';
import { useForm } from 'react-hook-form';
import { produce } from 'immer';

const AccountRegistration: React.FC<StepActions> = ({ nextStep }) => {
  const [show, setShow] = React.useState(false);
  const form = useContext(FormContext);

  const { register, handleSubmit, watch } = useForm({
    shouldUseNativeValidation: false,
    defaultValues: {
      first_name: form?.formState.steps.account.value.first_name ?? '',
      last_name: form?.formState.steps.account.value.last_name ?? '',
      email: form?.formState.steps.account.value.email ?? '',
      password: form?.formState.steps.account.value.password ?? '',
      repeat_password: form?.formState.steps.account.value.repeat_password ?? '',
      avatar: form?.formState.steps.account.value.avatar ?? '',
    },
  });

  const { ref: firstNameRef, ...firstNameControl } = register('first_name', {
    required: true,
  });
  const { ref: lastNameRef, ...lastNameControl } = register('last_name', {
    required: true,
  });
  const { ref: emailRef, ...emailControl } = register('email', {
    required: true,
  });
  const { ref: passwordRef, ...passwordControl } = register('password', {
    required: true,
  });
  const { ref: repeatPasswordRef, ...repeatPasswordControl } = register('repeat_password', {
    required: true,
    validate: (val: string) => {
      if (watch('password') != val) {
        return 'Your passwords do no match';
      }
    },
  });

  const avatarControl = register('avatar');

  const handleClick = (): void => setShow(!show);

  return (
    <Box
      py={6}
      as={'form'}
      onSubmit={handleSubmit((value) => {
        form?.setFormState(
          produce((state) => {
            state.steps.account = {
              valid: true,
              value,
            };
          })
        );

        nextStep();
      })}
    >
      <Flex>
        <FormControl mr="5%">
          <FormLabel htmlFor="first-name" fontWeight={'normal'}>
            First name
          </FormLabel>
          <Input
            id="first-name"
            placeholder="First name"
            ref={firstNameRef}
            {...firstNameControl}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="last-name" fontWeight={'normal'}>
            Last name
          </FormLabel>
          <Input id="last-name" placeholder="First name" ref={lastNameRef} {...lastNameControl} />
        </FormControl>
      </Flex>
      <FormControl mt="2%">
        <FormLabel htmlFor="email" fontWeight={'normal'}>
          Email address
        </FormLabel>
        <Input id="email" type="email" ref={emailRef} {...emailControl} />
        <FormHelperText>We will never share your email.</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="password" fontWeight={'normal'} mt="2%">
          Password
        </FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? 'text' : 'password'}
            placeholder="Enter password"
            ref={passwordRef}
            {...passwordControl}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormLabel htmlFor="email" fontWeight={'normal'}>
          Repeat Password
        </FormLabel>
        <Input
          id="repeat_password"
          type="password"
          ref={repeatPasswordRef}
          {...repeatPasswordControl}
        />
      </FormControl>
      <Flex width="100%" justifyContent="flex-end" my={6}>
        <Button size="sm" type="submit">
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default AccountRegistration;
