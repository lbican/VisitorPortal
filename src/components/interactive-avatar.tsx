import React from 'react';
import { Avatar, Box, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { RiSettings2Line, RiLogoutBoxLine } from 'react-icons/ri';
import { CurrentUser } from '../context/auth-context';

interface AvatarProps {
  user: CurrentUser;
  signOut: () => void;
}
const InteractiveAvatar: React.FC<AvatarProps> = ({ user, signOut }) => {
  return (
    <Box>
      <Menu>
        <Avatar size={'sm'} name={user?.full_name} src={user?.avatar_url} as={MenuButton} />
        <MenuList>
          <Text p={2}>{user?.full_name}</Text>
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
