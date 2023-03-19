import React, { useContext } from 'react';
import { Box } from '@chakra-ui/react';
import { StepActions } from '../definition/form-state';
import { FormContext } from '../definition/form-context';

const AccountComplete: React.FC<StepActions> = ({ nextStep }) => {
  const form = useContext(FormContext);

  return <Box>{JSON.stringify(form?.formState)}</Box>;
};

export default AccountComplete;
