import React from 'react';
import { Avatar, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { RiSettings2Line, RiLogoutBoxLine } from 'react-icons/ri';
interface Props {
  size: string;
  src?: string;
  name: string;
}

const InteractiveAvatar: React.FC<Props> = ({ size, src, name }) => {
  return (
    <Menu>
      <Avatar size={size} name={name} src={src} as={MenuButton} />
      <MenuList>
        <MenuItem icon={<RiSettings2Line size={20} />}>Settings</MenuItem>
        <MenuItem icon={<RiLogoutBoxLine size={20} />}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default InteractiveAvatar;
