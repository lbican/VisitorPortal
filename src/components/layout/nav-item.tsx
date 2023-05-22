import React, { ReactElement, ReactNode } from 'react';
import { Flex, Icon, useColorModeValue } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { NavLink, useLocation } from 'react-router-dom';

export interface NavItemProps {
    icon: IconType;
    children: ReactNode;
    route: string;
}

interface INavItemColors {
    bgColor: string[];
    color: string[];
    hoverBg: string[];
    hoverColor: string[];
}

const isSelected = (route: string, locationPath: string): INavItemColors => {
    if (route === locationPath) {
        return {
            bgColor: ['blue.500', 'blue.500'],
            color: ['gray.100', 'gray.100'],
            hoverBg: ['blue.600', 'blue.600'],
            hoverColor: ['gray.100', 'gray.100'],
        };
    } else
        return {
            bgColor: ['inherit', 'inherit'],
            color: ['inherit', 'gray.400'],
            hoverBg: ['gray.100', 'gray.900'],
            hoverColor: ['inherit', 'gray.200'],
        };
};

const NavItem: React.FC<NavItemProps> = ({ icon, children, route }): ReactElement => {
    const location = useLocation();
    const colors = isSelected(route, location.pathname);

    return (
        <Flex
            as={NavLink}
            to={route}
            align="center"
            px="4"
            py="3"
            bgColor={useColorModeValue(colors.bgColor[0], colors.bgColor[1])}
            color={useColorModeValue(colors.color[0], colors.color[1])}
            cursor="pointer"
            role="group"
            fontWeight="semibold"
            transition=".15s ease"
            roundedEnd="md"
            _hover={{
                bg: useColorModeValue(colors.hoverBg[0], colors.hoverBg[1]),
                color: useColorModeValue(colors.hoverColor[0], colors.hoverColor[1]),
            }}
        >
            {icon && <Icon mx="2" boxSize="4" as={icon} />}
            {children}
        </Flex>
    );
};

export default NavItem;
