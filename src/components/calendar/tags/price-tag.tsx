import React from 'react';
import { Flex, Skeleton, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import { isUndefined } from 'lodash';
import { IoPricetag, IoPricetagOutline } from 'react-icons/io5';
import { PriceStatus } from '../../../pages/calendar/calendar-page';

interface PriceTagProps {
    status: PriceStatus;
    price?: number;
    loading?: boolean;
}

const PriceTag: React.FC<PriceTagProps> = ({ price, status, loading }) => {
    return (
        <Flex justifyContent="flex-end" mb={-6} px={2}>
            <Skeleton isLoaded={!loading}>
                <Tag size="md" variant="solid" colorScheme={status} alignSelf="flex-end">
                    {status !== PriceStatus.UNSET && !isUndefined(price) ? (
                        <>
                            <TagLeftIcon as={IoPricetag} />
                            <TagLabel>{price} €</TagLabel>
                        </>
                    ) : (
                        <>
                            <TagLeftIcon as={IoPricetagOutline} />
                        </>
                    )}
                </Tag>
            </Skeleton>
        </Flex>
    );
};

export default PriceTag;
