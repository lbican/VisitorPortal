import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { usePropertyStore } from '../../mobx/propertyStoreContext';
import Banner from '../../components/common/banner';
import PropertyService from '../../services/property-service';
import BannerWrapper from '../../components/common/banner-wrapper';
import { Box, Heading, HStack, useDisclosure, VStack } from '@chakra-ui/react';
import PropertyTags from '../../components/property/property-tags';
import { AiFillEdit, AiOutlineEdit } from 'react-icons/ai';
import PropertyActionModal from '../../components/property/modal/property-action-modal';
import ReactiveButton from '../../components/common/reactive-button';
const PropertyPage = () => {
    const { pid = '' } = useParams<{ pid: string }>();
    const store = usePropertyStore();
    const { onOpen, isOpen, onClose } = useDisclosure();

    useEffect(() => {
        store.getCurrentProperty(pid);
    }, []);

    if (!store.currentProperty) {
        return (
            <p>
                Could not access current property, please click on current property from properties
                page
            </p>
        );
    }

    return (
        <>
            <Box>
                <BannerWrapper>
                    <Banner
                        banner_url={
                            PropertyService.getPropertyImage(store.currentProperty.image_path)?.url
                        }
                    >
                        <VStack alignItems="flex-start">
                            <Heading>{store.currentProperty.name}</Heading>
                            <PropertyTags
                                type={store.currentProperty.type}
                                location={store.currentProperty.location}
                            />
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
                        <ReactiveButton
                            onClick={() => {
                                store.setEditingProperty(store.currentProperty || undefined);
                                onOpen();
                            }}
                            text="Edit"
                            icon={<AiOutlineEdit />}
                            hoveredIcon={<AiFillEdit />}
                            colorScheme="blue"
                            isActive={isOpen}
                        />
                    </HStack>
                </BannerWrapper>
            </Box>
            <PropertyActionModal isOpen={isOpen} onClose={onClose} />
            <Heading as="h4" size="lg">
                Upcoming bookings
            </Heading>
        </>
    );
};

export default observer(PropertyPage);
