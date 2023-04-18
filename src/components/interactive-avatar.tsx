import React from 'react';
import { Avatar, Box, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { RiSettings2Line, RiLogoutBoxLine } from 'react-icons/ri';
import { User } from '@supabase/supabase-js';

interface AvatarProps {
    user: User;
    signOut: () => void;
}
const InteractiveAvatar: React.FC<AvatarProps> = ({ user, signOut }) => {
    return (
        <Box>
            <Menu>
                <Avatar
                    size="sm"
                    name={user.user_metadata['full_name']}
                    src={user.user_metadata['avatar_url']}
                    referrerPolicy="no-referrer"
                    as={MenuButton}
                />
                <MenuList>
                    <Text p={2}>{user.user_metadata['full_name']}</Text>
                    <MenuItem icon={<RiSettings2Line size={20} />}>Settings</MenuItem>
                    <MenuItem onClick={signOut} icon={<RiLogoutBoxLine size={20} />}>
                        Sign out
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
    );
};

export default InteractiveAvatar;
