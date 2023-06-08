import React, { ReactNode } from 'react';
import { Box, MenuList, MenuItem, Text, MenuDivider } from '@chakra-ui/react';
import { ContextMenu } from 'chakra-ui-contextmenu';
import { GoTrashcan } from 'react-icons/go';
import { AiOutlineEdit } from 'react-icons/ai'; // Use correct import here

type CustomContextMenuProps = {
    onMenuDelete: () => void;
    onMenuEdit: () => void;
    children?: ReactNode;
};

const CustomContextMenu: React.FC<CustomContextMenuProps> = ({
    onMenuDelete,
    children,
    onMenuEdit,
}) => (
    <ContextMenu<HTMLDivElement>
        renderMenu={() => (
            <MenuList>
                <MenuItem onClick={onMenuDelete}>
                    <GoTrashcan />
                    <Text ml={2}>Delete</Text>
                </MenuItem>
                <MenuItem onClick={onMenuEdit}>
                    <AiOutlineEdit />
                    <Text ml={2}>Edit</Text>
                </MenuItem>
                <MenuDivider />
                <MenuItem>Jump to calendar</MenuItem>
            </MenuList>
        )}
    >
        {(ref) => (
            <Box ref={ref} style={{ cursor: 'pointer' }}>
                {children}
            </Box>
        )}
    </ContextMenu>
);

export default CustomContextMenu;
