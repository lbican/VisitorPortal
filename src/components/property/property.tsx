import { Box, Flex, Image, Tag, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import Rating from '../common/rating';
import PropertyTags from './property-tags';
import { motion } from 'framer-motion';
import { IProperty } from '../../utils/interfaces/typings';

interface PropertyProps {
    property: IProperty;
}

const Property: React.FC<PropertyProps> = ({ property }) => {
    return (
        <Box
            as={motion.div}
            bg={useColorModeValue('white', 'gray.800')}
            w="sm"
            marginRight={4}
            marginBottom={4}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            borderWidth="1px"
            rounded="lg"
            shadow="lg"
            position="relative"
        >
            <Image
                src={property.imageUrl}
                objectFit="cover"
                alt={`Picture of ${property.name}`}
                roundedTop="lg"
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
                        Rooms: <Tag borderRadius="full">{property.rooms.length}</Tag>
                    </Text>
                </Flex>

                <Rating rating={property.rating} />
            </Box>
        </Box>
    );
};

export default Property;
