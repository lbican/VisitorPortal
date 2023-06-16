import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Banner from '../../components/common/banner/banner';
import PropertyService from '../../services/property-service';
import BannerWrapper from '../../components/common/banner/banner-wrapper';
import {
    Box,
    Flex,
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
import { ReservationService } from '../../services/reservation-service';
import Autocomplete, {
    ILabel,
    mapToAutocompleteLabels,
    mapValueToLabel,
} from '../../components/common/input/autocomplete';
import { IReservation, IUnit } from '../../utils/interfaces/typings';
import { SingleValue } from 'react-select';
import Timeline from '../../components/common/timeline';

const PropertyPage = () => {
    const { pid = '' } = useParams<{ pid: string }>();
    const { onOpen, isOpen, onClose } = useDisclosure();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [reservations, setReservations] = useState<IReservation[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<IUnit | null>(null);
    const [loadingTimeline, setLoadingTimeline] = useState(false);

    const resolveCurrentProperty = async () => {
        await store.fetchCurrentProperty(pid, user?.id);
    };

    const fetchPropertyReservations = () => {
        ReservationService.fetchReservations('')
            .then((reservations) => {
                console.log(reservations);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchReservations = () => {
        if (selectedUnit?.id) {
            setLoadingTimeline(true);
            ReservationService.fetchReservations(selectedUnit?.id)
                .then((res) => {
                    setReservations(res);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setLoadingTimeline(false);
                });
        }
    };

    useEffect(() => {
        fetchReservations();
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

    useEffect(() => {
        void resolveCurrentProperty();
        fetchPropertyReservations();
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
            <Timeline
                heading={t('Upcoming reservations')}
                reservations={reservations}
                loadingTimeline={loadingTimeline}
            />
        </>
    );
};

export default observer(PropertyPage);
