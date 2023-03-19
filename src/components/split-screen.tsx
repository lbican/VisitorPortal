import React, { ReactNode } from 'react';
import { Flex, Heading, Stack, useColorModeValue } from '@chakra-ui/react';
import ProgressiveImage from './progressive-image';

interface Props {
  title?: string;
  imageLink: string;
  children: ReactNode;
}

const SplitScreen: React.FC<Props> = ({ title, imageLink, children }) => {
  return (
    <Stack minH={'100vh'} direction={{ md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack
          spacing={4}
          p={8}
          w={'full'}
          maxW={'xl'}
          borderRadius={8}
          bg={useColorModeValue('gray.50', 'gray.700')}
        >
          {title && <Heading fontSize={'2xl'}>{title}</Heading>}
          {children}
        </Stack>
      </Flex>
      <Flex flex={1} display={{ sm: 'none', md: 'flex' }}>
        <ProgressiveImage imageLink={imageLink} imageAlt={'Action image'} />
      </Flex>
    </Stack>
  );
};

export default SplitScreen;
