import React, { ReactNode } from 'react';
import { Box, HStack, Input, Tag, TagLabel } from '@chakra-ui/react';
import { UseRadioProps, useRadio, UseRadioReturn, useRadioGroup } from '@chakra-ui/radio';
import { ThemeTypings } from '@chakra-ui/styled-system';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export interface RadioCardOptions extends UseRadioProps {
    icon: ReactNode;
    colorScheme: ThemeTypings['colorSchemes'];
    value: string;
}

const RadioCard: React.FC<RadioCardOptions> = (props) => {
    const { t } = useTranslation();
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
                p={5}
                justifyContent="center"
            >
                {props.icon}
                <TagLabel mx={2}>{t(props.value)}</TagLabel>
            </Tag>
        </Box>
    );
};

interface RadioGroupProps {
    options: RadioCardOptions[];
    defaultValue: string;
    onSelect: (option: string) => void;
}

const CustomButtonGroup: React.FC<RadioGroupProps> = ({ onSelect, defaultValue, options }) => {
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'Selector',
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

export default CustomButtonGroup;
