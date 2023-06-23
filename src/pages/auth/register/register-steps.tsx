import React, { ReactElement } from 'react';
import { Collapse, Flex, useSteps } from '@chakra-ui/react';
import { FormProvider } from './definition/form-context';
import AccountDetails from './parts/account-details';
import AccountSecurity from './parts/account-security';
import AccountComplete from './parts/account-complete';
import { useTranslation } from 'react-i18next';
import FormStepper from '../../../components/form/form-stepper';

const RegisterSteps = (): ReactElement => {
    const { activeStep, goToNext, goToPrevious } = useSteps({
        index: 0,
        count: 3,
    });

    const { t } = useTranslation();

    const steps = [
        {
            title: t('Account'),
            content: <AccountDetails nextStep={goToNext} />,
        },
        {
            title: t('Security'),
            content: <AccountSecurity nextStep={goToNext} prevStep={goToPrevious} />,
        },
        {
            title: t('Complete'),
            content: <AccountComplete nextStep={goToNext} prevStep={goToPrevious} />,
        },
    ];

    return (
        <FormProvider>
            <Flex flexDir="column" width="100%">
                <FormStepper steps={steps} activeStep={activeStep} orientation="horizontal" />
                {steps.map(({ title, content }, index) => (
                    <Collapse key={title} in={activeStep === index}>
                        {content}
                    </Collapse>
                ))}
            </Flex>
        </FormProvider>
    );
};

export default RegisterSteps;
