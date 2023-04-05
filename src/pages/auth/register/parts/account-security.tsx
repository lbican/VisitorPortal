import React, { useContext } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import { StepActions } from '../definition/form-state';
import { FormContext } from '../definition/form-context';
import { useForm } from 'react-hook-form';
import { produce } from 'immer';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const AccountSecurity: React.FC<StepActions> = ({ nextStep, prevStep }) => {
    const [show, setShow] = React.useState(false);
    const form = useContext(FormContext);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        shouldUseNativeValidation: false,
        defaultValues: {
            email: form?.formState.steps.security.value.email ?? '',
            password: form?.formState.steps.security.value.password ?? '',
            repeat_password: form?.formState.steps.security.value.repeat_password ?? '',
        },
    });

    const { ref: emailRef, ...emailControl } = register('email', {
        required: 'Email is required',
    });
    const { ref: passwordRef, ...passwordControl } = register('password', {
        required: 'Password is required',
    });
    const { ref: repeatPasswordRef, ...repeatPasswordControl } = register('repeat_password', {
        required: 'You need to repeat the password',
        validate: (val: string) => {
            if (watch('password') != val) {
                return 'Your passwords do no match';
            }
        },
    });

    const handleClick = (): void => setShow(!show);

    return (
        <Box
            py={6}
            as={'form'}
            onSubmit={handleSubmit((value) => {
                form?.setFormState(
                    produce((state) => {
                        state.steps.security = {
                            valid: true,
                            value,
                        };
                    })
                );

                nextStep();
            })}
        >
            <FormControl mt="2%" isInvalid={!!errors.email}>
                <FormLabel htmlFor="email" fontWeight={'normal'}>
                    Email address
                </FormLabel>
                <Input
                    id="email"
                    type="email"
                    placeholder="your@mail.com"
                    ref={emailRef}
                    {...emailControl}
                />
                <FormErrorMessage>{errors.email?.message?.toString()}</FormErrorMessage>
            </FormControl>

            <FormControl mt="2%" isInvalid={!!errors.password}>
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
                            {show ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password?.message?.toString()}</FormErrorMessage>
            </FormControl>
            <FormControl mt="2%" isInvalid={!!errors.repeat_password}>
                <FormLabel htmlFor="repeat_password" fontWeight={'normal'}>
                    Repeat Password
                </FormLabel>
                <Input
                    id="repeat_password"
                    type="password"
                    ref={repeatPasswordRef}
                    {...repeatPasswordControl}
                />
                <FormErrorMessage>{errors.repeat_password?.message?.toString()}</FormErrorMessage>
            </FormControl>
            <HStack spacing={2} width="100%" justifyContent="flex-end" my={6}>
                <Button size="sm" onClick={prevStep}>
                    Previous
                </Button>
                <Button size="sm" type="submit">
                    Next
                </Button>
            </HStack>
        </Box>
    );
};

export default AccountSecurity;
