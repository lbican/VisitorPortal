import React, { ReactElement } from 'react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { Flex } from '@chakra-ui/react';
import { FormProvider } from './definition/form-context';
import AccountRegistration from './parts/account-registration';
import AccountDetails from './parts/account-details';
import AccountComplete from './parts/account-complete';

const RegisterForm = (): ReactElement => {
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  const steps = [
    {
      label: 'Account',
      content: <AccountRegistration nextStep={nextStep} />,
    },
    {
      label: 'Details',
      content: <AccountDetails nextStep={nextStep} prevStep={prevStep} />,
    },
    { label: 'Complete', content: <AccountComplete nextStep={nextStep} /> },
  ];

  return (
    <FormProvider>
      <Flex flexDir="column" width="100%">
        <Steps activeStep={activeStep}>
          {steps.map(({ label, content }) => (
            <Step label={label} key={label}>
              {content}
            </Step>
          ))}
        </Steps>
      </Flex>
    </FormProvider>
  );
};

export default RegisterForm;
