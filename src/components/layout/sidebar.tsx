import React, { ReactNode, useCallback, useState } from 'react';
import {
    Box,
    Drawer,
    DrawerContent,
    useDisclosure,
    DrawerOverlay,
    useColorModeValue,
    Flex,
} from '@chakra-ui/react';
import SidebarContent from './sidebar-content';
import Header from './header';

const Sidebar: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [headerHeight, setHeaderHeight] = useState(0);
    const handleHeaderRef = useCallback((headerRef: HTMLDivElement | null) => {
        if (headerRef) {
            setHeaderHeight(headerRef.clientHeight || 56);
        }
    }, []);

    return (
        <Box as="section" bg={useColorModeValue('gray.50', 'gray.700')} minH="100vh">
            <SidebarContent display={{ base: 'none', md: 'unset' }} />
            <Drawer isOpen={isOpen} onClose={onClose} placement="left">
                <DrawerOverlay />
                <DrawerContent>
                    <SidebarContent w="full" borderRight="none" />
                </DrawerContent>
            </Drawer>
            <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
                <Header onOpen={onOpen} headerRef={handleHeaderRef} />

                <Flex
                    paddingLeft={{ base: '0', md: '4' }}
                    as="main"
                    bg={useColorModeValue('white', 'gray.800')}
                    height={`calc(100vh - ${headerHeight + 'px'});`}
                    flexDirection="column"
                >
                    {children}
                </Flex>
            </Box>
        </Box>
    );
};

export default Sidebar;
