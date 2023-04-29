import React from 'react';
import { Avatar, Box, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { RiSettings2Line, RiLogoutBoxLine } from 'react-icons/ri';
import { User } from '@supabase/supabase-js';
import _ from 'lodash';

interface AvatarProps {
    user: User;
    signOut: () => void;
}
const InteractiveAvatar: React.FC<AvatarProps> = ({ user, signOut }) => {
    const full_name: string = _.get(user, 'full_name', 'Unknown User');
    const avatar_url: string = _.get(user, 'avatar_url', '');
    console.log(user);

    return (
        <Box>
            <Menu>
                <Avatar
                    size="sm"
                    name={full_name}
                    src={avatar_url}
                    referrerPolicy="no-referrer"
                    as={MenuButton}
                />
                <MenuList>
                    <Text p={2}>{full_name}</Text>
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
