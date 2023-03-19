import React from 'react';
import { Flex, HStack, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import InteractiveAvatar from '../interactive-avatar';
import ColorModeSwitcher from '../color-mode-switcher';

interface Props {
  onOpen: () => void;
}

// TODO - Get current user from context and rerender accordingly
const Header: React.FC<Props> = ({ onOpen }) => {
  return (
    <Flex
      as="header"
      align="center"
      justify={{ base: 'space-between', md: 'flex-end' }}
      w="full"
      px="4"
      borderBottomWidth="1px"
      borderColor={useColorModeValue('inherit', 'gray.700')}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="sm"
      h="14"
    >
      <IconButton
        aria-label="Menu"
        display={{ base: 'inline-flex', md: 'none' }}
        onClick={onOpen}
        icon={<FiMenu />}
        size="md"
      />

      <HStack spacing={2}>
        <ColorModeSwitcher />
        <InteractiveAvatar size={'sm'} name={'Luka Bićan'} />
      </HStack>
    </Flex>
  );
};

export default Header;
