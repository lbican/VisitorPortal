import React, { ReactNode } from 'react';
import {
  Box,
  Drawer,
  DrawerContent,
  useDisclosure,
  DrawerOverlay,
  useColorModeValue,
} from '@chakra-ui/react';
import SidebarContent from './sidebar-content';
import Header from './header';

const Sidebar: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Box
      as="section"
      bg={useColorModeValue('gray.50', 'gray.700')}
      minH="100vh"
    >
      <SidebarContent display={{ base: 'none', md: 'unset' }} />
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
        <Header onOpen={onOpen} />

        <Box padding={'8'} as="main">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
