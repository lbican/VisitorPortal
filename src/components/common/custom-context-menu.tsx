import React, { ReactNode } from 'react';
import { Box, MenuList, MenuItem } from '@chakra-ui/react';
import { ContextMenu } from 'chakra-ui-contextmenu'; // Use correct import here

type CustomContextMenuProps = {
    key: string | number;
    onMenuDelete: () => void;
    children?: ReactNode;
};

const CustomContextMenu: React.FC<CustomContextMenuProps> = ({ key, onMenuDelete, children }) => (
    <ContextMenu<HTMLDivElement>
        key={key}
        renderMenu={() => (
            <MenuList>
                <MenuItem onClick={onMenuDelete}>Delete</MenuItem>
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
