import React from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
} from '@chakra-ui/react';
import { StepActions } from '../definition/form-state';

const AccountDetails: React.FC<StepActions> = ({ nextStep, prevStep }) => {
  return (
    <Box py={6}>
      <Flex>
        <FormControl mr="5%">
          <FormLabel htmlFor="country" fontWeight={'normal'}>
            Country
          </FormLabel>
          <Input id="country" placeholder="Country" />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="state" fontWeight={'normal'}>
            State
          </FormLabel>
          <Input id="state" placeholder="State" />
        </FormControl>
      </Flex>
      <FormControl my="2%">
        <FormLabel htmlFor="address" fontWeight={'normal'}>
          Address
        </FormLabel>
        <Input id="address" type="text" />
      </FormControl>

      <Flex>
        <FormControl mr="5%">
          <FormLabel htmlFor="country" fontWeight={'normal'}>
            City
          </FormLabel>
          <Input id="country" placeholder="City" />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="state" fontWeight={'normal'}>
            Postal code
          </FormLabel>
          <Input id="state" placeholder="Postal code" />
        </FormControl>
      </Flex>

      <HStack width="100%" spacing={2} justifyContent="flex-end" my={6}>
        <Button size="sm" onClick={prevStep}>
          Previous
        </Button>
        <Button size="sm" onClick={nextStep}>
          Next
        </Button>
      </HStack>
    </Box>
  );
};

export default AccountDetails;
