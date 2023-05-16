import React, { useRef } from 'react';
import { Flex, HStack, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import InteractiveAvatar from '../interactive-avatar';
import ColorModeSwitcher from '../color-mode-switcher';
import { useAuth } from '../../context/auth-context';

interface Props {
    onOpen: () => void;
    headerRef: (flexRef: HTMLDivElement | null) => void;
}

const Header: React.FC<Props> = ({ onOpen, headerRef }) => {
    const flexRef = useRef<HTMLDivElement>(null);
    const { user, signOut } = useAuth();

    React.useEffect(() => {
        headerRef(flexRef.current);
    }, [headerRef]);

    return (
        <Flex
            ref={flexRef}
            as="header"
            align="center"
            justify={{ base: 'space-between', md: 'flex-end' }}
            w="full"
            px="4"
            borderColor={useColorModeValue('inherit', 'gray.700')}
            bg={useColorModeValue('white', 'gray.800')}
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
                {user && <InteractiveAvatar user={user} signOut={signOut} />}
            </HStack>
        </Flex>
    );
};

export default Header;
