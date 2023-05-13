import { Box, BoxProps, Flex, Heading, useColorModeValue } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import NavItem from './nav-item';
import { AiOutlineTeam } from 'react-icons/ai';
import { BsCalendarCheck, BsHouses } from 'react-icons/bs';
import { RxDashboard } from 'react-icons/rx';

const SidebarContent = ({ ...props }: BoxProps): ReactElement => (
    <Box
        as="nav"
        pos="fixed"
        top="0"
        left="0"
        zIndex="sticky"
        h="full"
        pb="10"
        overflowX="hidden"
        overflowY="auto"
        bg={useColorModeValue('white', 'gray.800')}
        borderColor={useColorModeValue('inherit', 'gray.700')}
        w="60"
        {...props}
    >
        <Flex px="4" h="14" align="center">
            <Heading
                as="h2"
                fontSize="2xl"
                ml="2"
                color={useColorModeValue('brand.500', 'white')}
                fontWeight="semibold"
            >
                VisitorPortal
            </Heading>
        </Flex>
        <Flex
            direction="column"
            as="nav"
            fontSize="md"
            color="gray.600"
            aria-label="Main Navigation"
        >
            <NavItem icon={RxDashboard} route="/">
                Dashboard
            </NavItem>
            <NavItem icon={AiOutlineTeam} route="/team">
                Team
            </NavItem>
            <NavItem icon={BsHouses} route="/properties">
                Properties
            </NavItem>
            <NavItem icon={BsCalendarCheck} route="/calendar">
                Calendar
            </NavItem>
        </Flex>
    </Box>
);

export default SidebarContent;
