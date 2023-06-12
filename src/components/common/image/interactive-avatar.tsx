import React from 'react';
import {
    Avatar,
    Box,
    HStack,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
} from '@chakra-ui/react';
import { RiSettings2Line, RiLogoutBoxLine } from 'react-icons/ri';
import { UserProfile } from '../../../context/auth-context';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TagIcon from '../tag-icon';
import CroatiaSvg from '../../../assets/images/flags/hr.svg';
import GreatBritainSvg from '../../../assets/images/flags/gb.svg';
import i18n from 'i18next';

interface AvatarProps {
    user: UserProfile;
    signOut: () => void;
}
const InteractiveAvatar: React.FC<AvatarProps> = ({ user, signOut }) => {
    const { full_name, avatar_url, username } = user;
    const { t } = useTranslation();
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng).catch(() => {
            console.error('Could not change language!');
        });
    };

    return (
        <Box>
            <Menu>
                <Avatar
                    size="sm"
                    name={full_name}
                    src={avatar_url ?? ''}
                    referrerPolicy="no-referrer"
                    as={MenuButton}
                />
                <MenuList>
                    <Text p={2}>{full_name}</Text>
                    <MenuDivider />
                    <MenuItem
                        icon={<RiSettings2Line size={20} />}
                        as={NavLink}
                        to={`/user/${username}`}
                    >
                        {t('Settings')}
                    </MenuItem>
                    <MenuItem onClick={signOut} icon={<RiLogoutBoxLine size={20} />}>
                        {t('Sign out')}
                    </MenuItem>
                    <MenuDivider />
                    <Text p={2}>{t('Language')}</Text>
                    <HStack p={2}>
                        <TagIcon
                            src={CroatiaSvg}
                            iconName="Croatia"
                            label="Croatian"
                            onClick={() => changeLanguage('hr')}
                        />
                        <TagIcon
                            src={GreatBritainSvg}
                            iconName="Great Britain"
                            label="English"
                            onClick={() => changeLanguage('en')}
                        />
                    </HStack>
                </MenuList>
            </Menu>
        </Box>
    );
};

export default InteractiveAvatar;
