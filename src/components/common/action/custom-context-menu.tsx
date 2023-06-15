import React, { ReactNode } from 'react';
import { Box, MenuList, MenuItem, Text, MenuDivider } from '@chakra-ui/react';
import { ContextMenu } from 'chakra-ui-contextmenu';
import { GoTrashcan } from 'react-icons/go';
import { AiOutlineEdit } from 'react-icons/ai';
import { useTranslation } from 'react-i18next'; // Use correct import here

type CustomContextMenuProps = {
    onMenuDelete: () => void;
    onMenuEdit: () => void;
    onJumpToCalendar: () => void;
    children?: ReactNode;
};

const CustomContextMenu: React.FC<CustomContextMenuProps> = ({
    onMenuDelete,
    children,
    onMenuEdit,
    onJumpToCalendar,
}) => {
    const { t } = useTranslation();

    return (
        <ContextMenu<HTMLDivElement>
            renderMenu={() => (
                <MenuList>
                    <MenuItem onClick={onMenuDelete}>
                        <GoTrashcan />
                        <Text ml={2}>{t('Delete')}</Text>
                    </MenuItem>
                    <MenuItem onClick={onMenuEdit}>
                        <AiOutlineEdit />
                        <Text ml={2}>{t('Edit')}</Text>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={onJumpToCalendar}>
                        {t('Jump to calendar')}
                    </MenuItem>
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
