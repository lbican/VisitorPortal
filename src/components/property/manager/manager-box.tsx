import React, { useState } from 'react';
import { IProperty, ManagerType, PropertyManager } from '../../../utils/interfaces/typings';
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
import { BsPersonBadge, BsPersonBadgeFill } from 'react-icons/bs';

interface ManagerBoxProps {
    propertyManagers: PropertyManager[];
    isFetching: boolean;
    currentProperty: IProperty | null;
    userId?: string;
    onRemoveManager: (propertyManagers: PropertyManager[]) => void;
}

const ManagerBox: React.FC<ManagerBoxProps> = (props) => {
    const { t } = useTranslation();
    const managerBackground = useColorModeValue('#F7FAFC', 'gray.700');
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const notification = useToastNotification();

    const canManageManagers = (managerRole: ManagerType) => {
        return (
            props.currentProperty?.manager_type === ManagerType.OWNER &&
            managerRole === ManagerType.MANAGER
        );
    };

    const removeSelectedManager = (userId: string) => {
        setLoadingStates((prev) => ({ ...prev, [userId]: true }));
        PropertyService.removePropertyManager(userId, props.currentProperty?.id)
            .then(() => {
                notification.success(t('Manager successfully removed!'));
                props.onRemoveManager(props.propertyManagers.filter((user) => user.id !== userId));
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
        <Wrap
            bg="#edf3f8"
            _dark={{
                bg: 'gray.800',
            }}
            p={4}
            rounded={4}
            boxShadow="lg"
        >
            <Heading as="h4" size="md">
                {t('Property managers')}
            </Heading>
            {props.isFetching ? (
                <Spinner />
            ) : (
                props.propertyManagers.map((manager) => (
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
                                {manager.id === props.userId && <GoStar />}
                                {canManageManagers(manager.manager_type) && (
                                    <IconButton
                                        aria-label="Remove manager"
                                        icon={<AiOutlineUserDelete />}
                                        colorScheme="red"
                                        size="sm"
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

export default ManagerBox;
