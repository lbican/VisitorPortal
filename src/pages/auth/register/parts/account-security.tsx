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
import { motion } from 'framer-motion';
import {
    emailValidator,
    passwordValidator,
    repeatPasswordValidator,
} from '../../../../services/validators';
import { useTranslation } from 'react-i18next';

const AccountSecurity: React.FC<StepActions> = ({ nextStep, prevStep }) => {
    const [show, setShow] = React.useState(false);
    const form = useContext(FormContext);
    const { t } = useTranslation();

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

    const { ref: emailRef, ...emailControl } = register('email', emailValidator);
    const { ref: passwordRef, ...passwordControl } = register(
        'password',
        passwordValidator
    );
    const { ref: repeatPasswordRef, ...repeatPasswordControl } = register(
        'repeat_password',
        repeatPasswordValidator(watch)
    );

    const handleClick = (): void => setShow(!show);

    return (
        <motion.div
            key="security"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Box
                py={6}
                as="form"
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
                    <FormLabel htmlFor="email" fontWeight="normal">
                        {t('Email address')}
                    </FormLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="your@mail.com"
                        ref={emailRef}
                        {...emailControl}
                    />
                    <FormErrorMessage>
                        {errors.email?.message?.toString()}
                    </FormErrorMessage>
                </FormControl>

                <FormControl mt="2%" isInvalid={!!errors.password}>
                    <FormLabel htmlFor="password" fontWeight="normal" mt="2%">
                        {t('Password')}
                    </FormLabel>
                    <InputGroup size="md">
                        <Input
                            pr="4.5rem"
                            type={show ? 'text' : 'password'}
                            placeholder={t('Enter password') ?? ''}
                            ref={passwordRef}
                            {...passwordControl}
                        />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={handleClick}>
                                {show ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                        {errors.password?.message?.toString()}
                    </FormErrorMessage>
                </FormControl>
                <FormControl mt="2%" isInvalid={!!errors.repeat_password}>
                    <FormLabel htmlFor="repeat_password" fontWeight="normal">
                        {t('Repeat password')}
                    </FormLabel>
                    <Input
                        id="repeat_password"
                        type="password"
                        ref={repeatPasswordRef}
                        {...repeatPasswordControl}
                    />
                    <FormErrorMessage>
                        {errors.repeat_password?.message?.toString()}
                    </FormErrorMessage>
                </FormControl>
                <HStack spacing={2} width="100%" justifyContent="flex-end" my={6}>
                    <Button size="sm" onClick={prevStep}>
                        {t('Previous')}
                    </Button>
                    <Button size="sm" type="submit">
                        {t('Next')}
                    </Button>
                </HStack>
            </Box>
        </motion.div>
    );
};

export default AccountSecurity;
