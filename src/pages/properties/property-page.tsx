import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Banner from '../../components/common/banner/banner';
import PropertyService from '../../services/property-service';
import BannerWrapper from '../../components/common/banner/banner-wrapper';
import {
    Avatar,
    Box,
    Flex,
    Grid,
    GridItem,
    Heading,
    HStack,
    IconButton,
    Skeleton,
    Spinner,
    Text,
    useColorModeValue,
    useDisclosure,
    VStack,
    Wrap,
} from '@chakra-ui/react';
import PropertyTags from '../../components/property/form/property-tags';
import { AiFillEdit, AiOutlineEdit, AiOutlineUserDelete } from 'react-icons/ai';
import PropertyActionModal from './form/property-action-modal';
import ReactiveButton from '../../components/common/input/reactive-button';
import { propertyStore as store } from '../../mobx/propertyStore';
import { useAuth } from '../../context/auth-context';
import { useTranslation } from 'react-i18next';
import EmptyState from '../../components/common/feedback/empty-state';
import Autocomplete, {
    ILabel,
    mapToAutocompleteLabels,
    mapValueToLabel,
} from '../../components/common/input/autocomplete';
import { IUnit, ManagerType } from '../../utils/interfaces/typings';
import { SingleValue } from 'react-select';
import Timeline from '../../components/common/timeline';
import { reservationStore } from '../../mobx/reservationStore';
import { GoStar } from 'react-icons/go';
import useToastNotification from '../../hooks/useToastNotification';

const PropertyPage = () => {
    const { pid = '' } = useParams<{ pid: string }>();
    const { onOpen, isOpen, onClose } = useDisclosure();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [selectedUnit, setSelectedUnit] = useState<IUnit | null>(null);
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const managersBackground = useColorModeValue('white', 'gray.800');
    const managerBackground = useColorModeValue('whitesmoke', 'gray.700');
    const notification = useToastNotification();

    const resolveCurrentProperty = useCallback(async () => {
        await store.fetchCurrentProperty(pid, user?.id);
    }, [pid, user]);

    useEffect(() => {
        reservationStore.fetchUnitReservations(selectedUnit?.id);
    }, [selectedUnit]);

    const handleUnitSelect = (newValue: SingleValue<ILabel>) => {
        if (!store.currentProperty?.units || !newValue) {
            return null;
        }

        const unitIndex = store.currentProperty.units.findIndex((unit) => {
            return unit.id == newValue.value;
        });

        if (unitIndex > -1) {
            setSelectedUnit(store.currentProperty.units[unitIndex]);
        }
    };

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

    useEffect(() => {
        void resolveCurrentProperty();
        reservationStore.setReservations([]);
    }, []);

    const canManageManagers = (managerRole: ManagerType) => {
        return (
            store.currentProperty?.manager_type === ManagerType.OWNER &&
            managerRole === ManagerType.MANAGER
        );
    };

    if (!store.currentProperty) {
        if (!store.isFetching) {
            return (
                <EmptyState
                    code={404}
                    message={t('Could not find property you are looking for')}
                    shortMessage={t('Property not found')}
                />
            );
        } else {
            return (
                <Flex justifyContent="center" alignItems="center" height="100%">
                    <Spinner size="lg" />
                </Flex>
            );
        }
    }

    return (
        <>
            <Box>
                <BannerWrapper>
                    <Banner
                        banner_url={
                            store.isFetching
                                ? undefined
                                : PropertyService.getPropertyImage(
                                      store.currentProperty.image_path
                                  )?.url
                        }
                    >
                        <VStack alignItems="flex-start">
                            <Skeleton isLoaded={!store.isFetching}>
                                <Heading color="white">
                                    {store.currentProperty.name}
                                </Heading>
                            </Skeleton>
                            <Skeleton isLoaded={!store.isFetching}>
                                <PropertyTags
                                    type={store.currentProperty.type}
                                    location={store.currentProperty.location}
                                />
                            </Skeleton>
                        </VStack>
                    </Banner>
                    <HStack
                        justifyContent="flex-end"
                        px={8}
                        my={4}
                        width="full"
                        borderRadius="lg"
                        textAlign="left"
                    >
                        <Autocomplete
                            value={mapValueToLabel(selectedUnit)}
                            onSelect={handleUnitSelect}
                            placeholder={t('Select unit') ?? ''}
                            options={mapToAutocompleteLabels<IUnit>(
                                store.currentProperty?.units ?? []
                            )}
                            isDisabled={!store.currentProperty}
                            width="14rem"
                            isLoading={store.isFetching}
                        />
                        <Skeleton isLoaded={!store.isFetching}>
                            <ReactiveButton
                                onClick={() => {
                                    store.setEditingProperty(
                                        store.currentProperty ?? undefined
                                    );
                                    onOpen();
                                }}
                                text={t('Edit')}
                                icon={<AiOutlineEdit />}
                                hoveredIcon={<AiFillEdit />}
                                colorScheme="blue"
                                isActive={isOpen}
                            />
                        </Skeleton>
                    </HStack>
                </BannerWrapper>
            </Box>
            <PropertyActionModal isOpen={isOpen} onClose={onClose} />
            <Grid templateColumns={['repeat(1, 1fr)', null, '3fr 1fr']} gap={6} w="full">
                <GridItem order={[2, null, 1]} w="100%">
                    <Heading
                        as="h3"
                        fontSize="4xl"
                        fontWeight="bold"
                        mb={18}
                        textAlign="left"
                    >
                        {t('Upcoming reservations')}
                    </Heading>
                    {selectedUnit ? (
                        <Timeline
                            reservations={reservationStore.reservations}
                            loadingTimeline={reservationStore.isFetchingData}
                        />
                    ) : (
                        <Text>
                            {t('Please select unit to view upcoming reservations')}
                        </Text>
                    )}
                </GridItem>
                <GridItem order={[1, null, 2]} w="100%">
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
                                        <HStack
                                            as={NavLink}
                                            to={`/user/${manager.username}`}
                                        >
                                            <Avatar
                                                size="sm"
                                                src={manager.avatar_url ?? undefined}
                                                name={manager.full_name}
                                            />
                                            <Text as="b">{manager.username}</Text>
                                        </HStack>
                                        <HStack>
                                            <Text>{manager.manager_type}</Text>
                                            {manager.id === user?.id && <GoStar />}
                                            {canManageManagers(manager.manager_type) && (
                                                <IconButton
                                                    aria-label="Remove manager"
                                                    icon={<AiOutlineUserDelete />}
                                                    colorScheme="red"
                                                    isLoading={
                                                        loadingStates[manager.id] || false
                                                    }
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
                </GridItem>
            </Grid>
        </>
    );
};

export default observer(PropertyPage);
