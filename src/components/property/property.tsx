import { Box, Flex, Tag, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import Rating from '../common/input/rating';
import PropertyTags from './form/property-tags';
import { motion } from 'framer-motion';
import { IProperty } from '../../utils/interfaces/typings';
import PropertyService from '../../services/property-service';
import ProgressiveImage from '../common/image/progressive-image';

interface PropertyProps {
    property: IProperty;
}

const UNRESOLVED_IMAGE = 'https://placehold.co/600x400?text=Unknown+image';

const Property: React.FC<PropertyProps> = ({ property }) => {
    return (
        <Box
            as={motion.div}
            bg={useColorModeValue('white', 'gray.800')}
            w="sm"
            whileHover={{ translateY: -10 }}
            borderWidth="1px"
            rounded="lg"
            shadow="lg"
            position="relative"
        >
            <ProgressiveImage
                imageLink={
                    PropertyService.getPropertyImage(property.image_path)?.url ?? UNRESOLVED_IMAGE
                }
                imageAlt={`Picture of ${property.name}`}
                borderRadius="0.5rem 0.5rem 0 0"
                height="20rem"
                width="100%"
            />

            <Box p="4">
                <PropertyTags type={property.type} location={property.location} />
                <Flex mt="1" justifyContent="space-between" alignContent="flex-start">
                    <Box
                        fontSize="2xl"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated
                    >
                        {property.name}
                    </Box>
                    <Text fontSize="sm" as="b">
                        {'Units: '}
                        <Tag borderRadius="full">{property.units ? property.units.length : 0}</Tag>
                    </Text>
                </Flex>

                {property.rating ? <Rating rating={property.rating} /> : <Text>No rating</Text>}
            </Box>
        </Box>
    );
};

export default Property;
