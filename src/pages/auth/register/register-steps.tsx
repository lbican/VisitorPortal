import React, { ReactElement } from 'react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { Alert, AlertIcon, Box, Button, Flex } from '@chakra-ui/react';
import { FormProvider } from './definition/form-context';
import AccountDetails from './parts/account-details';
import AccountSecurity from './parts/account-security';
import AccountComplete from './parts/account-complete';
import { AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const RegisterSteps = (): ReactElement => {
    const { nextStep, prevStep, activeStep } = useSteps({
        initialStep: 0,
    });

    const steps = [
        {
            label: 'Account',
            content: <AccountDetails nextStep={nextStep} />,
        },
        {
            label: 'Security',
            content: <AccountSecurity nextStep={nextStep} prevStep={prevStep} />,
        },
        {
            label: 'Complete',
            content: <AccountComplete nextStep={nextStep} prevStep={prevStep} />,
        },
    ];

    return (
        <FormProvider>
            <Flex flexDir="column" width="100%">
                <Steps colorScheme="blue" activeStep={activeStep}>
                    {steps.map(({ label, content }) => (
                        <Step label={label} key={label}>
                            <AnimatePresence>{content}</AnimatePresence>
                        </Step>
                    ))}
                </Steps>
                {activeStep === 3 && (
                    <Box py={4}>
                        <Alert status="success" variant="subtle">
                            <AlertIcon />
                            <Flex justifyContent="space-between" alignItems="center" w="100%">
                                Account successfully created!
                                <Button variant="solid" as={NavLink} to="/">
                                    Get started
                                </Button>
                            </Flex>
                        </Alert>
                    </Box>
                )}
            </Flex>
        </FormProvider>
    );
};

export default RegisterSteps;