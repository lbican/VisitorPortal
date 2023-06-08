import { HStack, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import React from 'react';
import { PropertyType } from '../../../utils/interfaces/typings';
import { MdLocationPin } from 'react-icons/md';

interface IPropertyTagsProps {
    type: PropertyType;
    location?: string;
}

const PropertyTags: React.FC<IPropertyTagsProps> = ({ type, location }) => {
    let colorScheme: string;

    switch (type) {
        case PropertyType.HOUSE:
            colorScheme = 'green';
            break;
        case PropertyType.HOTEL:
            colorScheme = 'red';
            break;
        case PropertyType.APARTMENT:
            colorScheme = 'yellow';
            break;
        default:
            colorScheme = 'gray';
    }

    return (
        <HStack spacing={2}>
            <Tag size="md" variant="solid" colorScheme={colorScheme}>
                {type}
            </Tag>
            {location && (
                <Tag size="md" variant="solid" colorScheme="blue">
                    <TagLeftIcon as={MdLocationPin} />
                    <TagLabel>{location}</TagLabel>
                </Tag>
            )}
        </HStack>
    );
};

export default PropertyTags;
