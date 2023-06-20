import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Banner from '../../components/common/banner/banner';
import PropertyService from '../../services/property-service';
import BannerWrapper from '../../components/common/banner/banner-wrapper';
import {
    Alert,
    AlertIcon,
    Box,
    Flex,
    Grid,
    GridItem,
    Heading,
    HStack,
    Skeleton,
    Spinner,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import PropertyTags from '../../components/property/form/property-tags';
import { AiFillEdit, AiOutlineEdit } from 'react-icons/ai';
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
import { IUnit } from '../../utils/interfaces/typings';
import { SingleValue } from 'react-select';
import Timeline from '../../components/common/timeline/timeline';
import { reservationStore } from '../../mobx/reservationStore';
import ManagerBox from '../../components/property/manager/manager-box';
import { motion } from 'framer-motion';

const PropertyPage = () => {
    const { pid = '' } = useParams<{ pid: string }>();
    const { onOpen, isOpen, onClose } = useDisclosure();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [selectedUnit, setSelectedUnit] = useState<IUnit | null>(null);

    const resolveCurrentProperty = useCallback(async () => {
        await store.fetchCurrentProperty(pid, user?.id);
    }, [pid, user]);

    useEffect(() => {
        reservationStore.fetchUnitReservations(selectedUnit?.id);
    }, [selectedUnit]);

    useEffect(() => {
        return () => {
            store.setPropertyManagers([]);
        };
    }, []);

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

    useEffect(() => {
        void resolveCurrentProperty();
        reservationStore.setReservations([]);
    }, []);

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
        <motion.div
            key="property_page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Box>
                <BannerWrapper>
                    <Banner
                        banner_url={
                            store.isFetching
                                ? undefined
                                : PropertyService.getPropertyImage(store.currentProperty.image_path)
                                      ?.url
                        }
                    >
                        <VStack alignItems="flex-start">
                            <Skeleton isLoaded={!store.isFetching}>
                                <Heading color="white">{store.currentProperty.name}</Heading>
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
                                    store.setEditingProperty(store.currentProperty ?? undefined);
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
                    <Heading as="h3" fontSize="3xl" fontWeight="bold" mb={18} textAlign="left">
                        {t('Upcoming arrivals / departures')}
                    </Heading>
                    {selectedUnit ? (
                        <Timeline
                            reservations={reservationStore.reservations.filter(
                                (res) => !res.fulfilled
                            )}
                            loadingTimeline={reservationStore.isFetchingData}
                        />
                    ) : (
                        <Alert status="info" mb={2} rounded={4}>
                            <AlertIcon />
                            {t('Please select unit to view upcoming arrivals and departures')}
                        </Alert>
                    )}
                </GridItem>
                <GridItem order={[1, null, 2]} w="100%">
                    <ManagerBox userId={user?.id} />
                </GridItem>
            </Grid>
        </motion.div>
    );
};

export default observer(PropertyPage);
