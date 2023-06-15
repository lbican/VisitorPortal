import React from 'react';
import { Avatar, Button, Tag, TagLabel } from '@chakra-ui/react';

interface TagIconProps {
    src: string;
    iconName: string;
    label: string;
    onClick?: () => void;
}

const TagIcon: React.FC<TagIconProps> = ({ src, iconName, label, onClick }) => {
    return (
        <Tag
            size="lg"
            as={Button}
            colorScheme="red"
            borderRadius="full"
            onClick={onClick}
        >
            <Avatar src={src} size="xs" name={iconName} ml={-1} mr={2} />
            <TagLabel>{label}</TagLabel>
        </Tag>
    );
};

export default TagIcon;
