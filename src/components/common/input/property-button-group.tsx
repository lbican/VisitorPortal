import React, { ReactNode } from 'react';
import { Box, HStack, Input, Tag, TagLabel } from '@chakra-ui/react';
import { UseRadioProps, useRadio, UseRadioReturn, useRadioGroup } from '@chakra-ui/radio';
import { ThemeTypings } from '@chakra-ui/styled-system';
import { PropertyType } from '../../../utils/interfaces/typings';
import { MdOutlineApartment, MdOutlineHotel, MdOutlineHouse } from 'react-icons/all';
import { motion } from 'framer-motion';

interface RadioCardProps extends UseRadioProps {
    icon: ReactNode;
    colorScheme: ThemeTypings['colorSchemes'];
    value: string;
}

const RadioCard: React.FC<RadioCardProps> = (props) => {
    const { getInputProps, getRadioProps }: UseRadioReturn = useRadio(props);

    const input = getInputProps();
    const checkbox = getRadioProps();

    return (
        <Box as="label">
            <Input {...input} />
            <Tag
                as={motion.div}
                whileHover={{ rotateZ: 4 }}
                whileTap={{ scale: 0.9 }}
                {...checkbox}
                size="lg"
                cursor="pointer"
                borderRadius="md"
                colorScheme={props.colorScheme}
                _checked={{
                    outline: '1px solid hotpink',
                }}
                p={2}
                justifyContent="center"
            >
                {props.icon}
                <TagLabel mx={2}>{props.value}</TagLabel>
            </Tag>
        </Box>
    );
};

interface RadioGroupProps {
    defaultValue: PropertyType;
    onSelect: (option: string) => void;
}

const PropertyButtonGroup: React.FC<RadioGroupProps> = ({ onSelect, defaultValue }) => {
    const options: RadioCardProps[] = [
        {
            value: PropertyType.APARTMENT,
            icon: <MdOutlineHotel />,
            colorScheme: 'yellow',
        },
        {
            value: PropertyType.HOTEL,
            icon: <MdOutlineApartment />,
            colorScheme: 'red',
        },
        {
            value: PropertyType.HOUSE,
            icon: <MdOutlineHouse />,
            colorScheme: 'green',
        },
    ];

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'Property type',
        defaultValue: defaultValue,
        onChange: onSelect,
    });

    const group = getRootProps();

    return (
        <HStack {...group} justifyContent="flex-start">
            {options.map((card) => {
                const { value } = card;

                const radio = getRadioProps({ value });
                return <RadioCard key={card.value} {...radio} {...card} />;
            })}
        </HStack>
    );
};

export default PropertyButtonGroup;
