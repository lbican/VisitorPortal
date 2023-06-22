import React from 'react';
import { Flex, Skeleton, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import { isUndefined } from 'lodash';
import { IoPricetag, IoPricetagOutline } from 'react-icons/io5';
import { PriceStatus } from '../../../pages/calendar/calendar-page';
import { observer } from 'mobx-react-lite';
import { motion, Variants } from 'framer-motion';

interface PriceTagProps {
    status: PriceStatus;
    price?: number;
    loading?: boolean;
    variants?: Variants;
}

const MotionTag = motion(Tag);

const PriceTag: React.FC<PriceTagProps> = ({ price, status, loading, variants }) => {
    return (
        <Flex justifyContent="flex-end" mb={-6} px={2}>
            <Skeleton isLoaded={!loading}>
                <MotionTag
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    size="md"
                    variant="solid"
                    colorScheme={status}
                    alignSelf="flex-end"
                    variants={variants}
                >
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
                </MotionTag>
            </Skeleton>
        </Flex>
    );
};

export default observer(PriceTag);
