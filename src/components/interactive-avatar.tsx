import React from 'react';
import { Avatar, Box, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { RiSettings2Line, RiLogoutBoxLine } from 'react-icons/ri';
import { UserProfile } from '../context/auth-context';
import { NavLink } from 'react-router-dom';

interface AvatarProps {
    user: UserProfile;
    signOut: () => void;
}
const InteractiveAvatar: React.FC<AvatarProps> = ({ user, signOut }) => {
    const { full_name, avatar_url, username } = user;

    return (
        <Box>
            <Menu>
                <Avatar
                    size="sm"
                    name={full_name}
                    src={avatar_url || ''}
                    referrerPolicy="no-referrer"
                    as={MenuButton}
                />
                <MenuList>
                    <Text p={2}>{full_name}</Text>
                    <MenuItem
                        icon={<RiSettings2Line size={20} />}
                        as={NavLink}
                        to={`/user/${username}`}
                    >
                        Settings
                    </MenuItem>
                    <MenuItem onClick={signOut} icon={<RiLogoutBoxLine size={20} />}>
                        Sign out
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
    );
};

export default InteractiveAvatar;
