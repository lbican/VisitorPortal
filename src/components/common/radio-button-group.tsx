import React, { ReactNode } from 'react';
import { Box, HStack, Input, Tag, TagLabel } from '@chakra-ui/react';
import { UseRadioProps, useRadio, UseRadioReturn, useRadioGroup } from '@chakra-ui/radio';

interface RadioCardProps extends UseRadioProps {
    children?: ReactNode;
}

const RadioCard: React.FC<RadioCardProps> = (props) => {
    const { getInputProps, getRadioProps }: UseRadioReturn = useRadio(props);

    const input = getInputProps();
    const checkbox = getRadioProps();

    return (
        <Box as="label">
            <Input {...input} />
            <Tag
                {...checkbox}
                cursor="pointer"
                borderWidth={1}
                borderRadius="md"
                colorScheme="blue"
                _checked={{
                    bg: 'blue.500',
                    color: 'white',
                    borderColor: 'blue.500',
                }}
                _focus={{
                    boxShadow: 'outline',
                }}
                p="10px"
                justifyContent="center"
            >
                <TagLabel>{props.children}</TagLabel>
            </Tag>
        </Box>
    );
};

interface RadioGroupProps {
    options: string[];
    onSelect: (option: string) => void;
}

const RadioButtonGroup: React.FC<RadioGroupProps> = ({ options, onSelect }) => {
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'Property type',
        defaultValue: 'House',
        onChange: onSelect,
    });

    const group = getRootProps();

    return (
        <HStack {...group} justifyContent="flex-start">
            {options.map((value) => {
                const radio = getRadioProps({ value });
                return (
                    <RadioCard key={value} {...radio}>
                        {value}
                    </RadioCard>
                );
            })}
        </HStack>
    );
};

export default RadioButtonGroup;
