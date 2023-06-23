import React, { ReactNode } from 'react';
import { Box, MenuList, MenuItem, Text, MenuDivider } from '@chakra-ui/react';
import { ContextMenu } from 'chakra-ui-contextmenu';
import { GoTrash } from 'react-icons/go';
import { AiOutlineEdit, AiOutlineUserAdd } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';

type CustomContextMenuProps = {
    isOwner: boolean;
    onMenuDelete: () => void;
    onMenuEdit: () => void;
    onAddManagerClick: () => void;
    onJumpToCalendar: () => void;
    children?: ReactNode;
};

const CustomContextMenu: React.FC<CustomContextMenuProps> = ({
    isOwner,
    onMenuDelete,
    children,
    onMenuEdit,
    onAddManagerClick,
    onJumpToCalendar,
}) => {
    const { t } = useTranslation();

    return (
        <ContextMenu<HTMLDivElement>
            renderMenu={() => (
                <MenuList>
                    {isOwner && (
                        <MenuItem onClick={onMenuDelete}>
                            <GoTrash />
                            <Text ml={2}>{t('Delete')}</Text>
                        </MenuItem>
                    )}
                    <MenuItem onClick={onMenuEdit}>
                        <AiOutlineEdit />
                        <Text ml={2}>{t('Edit')}</Text>
                    </MenuItem>
                    {isOwner && (
                        <MenuItem onClick={onAddManagerClick}>
                            <AiOutlineUserAdd />
                            <Text ml={2}>{t('Add manager')}</Text>
                        </MenuItem>
                    )}
                    <MenuDivider />
                    <MenuItem onClick={onJumpToCalendar}>{t('Jump to calendar')}</MenuItem>
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
};

export default CustomContextMenu;
