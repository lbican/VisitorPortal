import React, { useState } from 'react';
import { ManagerType } from '../../../utils/interfaces/typings';
import { propertyStore as store } from '../../../mobx/propertyStore';
import {
    Avatar,
    Box,
    Heading,
    HStack,
    IconButton,
    Spinner,
    Text,
    useColorModeValue,
    Wrap,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { GoStar } from 'react-icons/go';
import { AiOutlineUserDelete } from 'react-icons/ai';
import PropertyService from '../../../services/property-service';
import useToastNotification from '../../../hooks/useToastNotification';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { BsPersonBadge, BsPersonBadgeFill } from 'react-icons/bs';

interface ManagerBoxProps {
    userId?: string;
}

const canManageManagers = (managerRole: ManagerType) => {
    return (
        store.currentProperty?.manager_type === ManagerType.OWNER &&
        managerRole === ManagerType.MANAGER
    );
};

const ManagerBox: React.FC<ManagerBoxProps> = ({ userId }) => {
    const { t } = useTranslation();
    const managerBackground = useColorModeValue('whitesmoke', 'gray.700');
    const managersBackground = useColorModeValue('white', 'gray.800');
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const notification = useToastNotification();

    const removeSelectedManager = (userId: string) => {
        setLoadingStates((prev) => ({ ...prev, [userId]: true }));
        PropertyService.removePropertyManager(userId, store.currentProperty?.id)
            .then(() => {
                notification.success(t('Manager successfully removed!'));
                store.setPropertyManagers(
                    store.propertyManagers?.filter((user) => user.id !== userId) ?? []
                );
            })
            .catch((error) => {
                console.error(error);
                notification.error(t('Could not remove property manager'));
            })
            .finally(() => {
                setLoadingStates((prev) => ({ ...prev, [userId]: false }));
            });
    };

    return (
        <Wrap bg={managersBackground} p={4} rounded={4}>
            <Heading as="h4" size="md">
                {t('Property managers')}
            </Heading>
            {store.isFetching ? (
                <Spinner />
            ) : (
                store.propertyManagers?.map((manager) => (
                    <Box
                        borderRadius={4}
                        key={manager.id}
                        bg={managerBackground}
                        my={1}
                        p={2}
                        justifyContent="space-between"
                        w="full"
                    >
                        <HStack justifyContent="space-between" w="full">
                            <HStack as={NavLink} to={`/user/${manager.username}`}>
                                <Avatar
                                    size="sm"
                                    src={manager.avatar_url ?? undefined}
                                    name={manager.full_name}
                                />
                                <Text as="b">{manager.username}</Text>
                            </HStack>
                            <HStack>
                                {manager.manager_type === ManagerType.MANAGER ? (
                                    <>
                                        <Text>{t('MNG.')}</Text>
                                        <BsPersonBadge />
                                    </>
                                ) : (
                                    <>
                                        <Text>{t('OWN.')}</Text>
                                        <BsPersonBadgeFill />
                                    </>
                                )}
                                {manager.id === userId && <GoStar />}
                                {canManageManagers(manager.manager_type) && (
                                    <IconButton
                                        aria-label="Remove manager"
                                        icon={<AiOutlineUserDelete />}
                                        colorScheme="red"
                                        isLoading={loadingStates[manager.id] || false}
                                        onClick={() => {
                                            removeSelectedManager(manager.id);
                                        }}
                                    />
                                )}
                            </HStack>
                        </HStack>
                    </Box>
                ))
            )}
        </Wrap>
    );
};

export default observer(ManagerBox);
