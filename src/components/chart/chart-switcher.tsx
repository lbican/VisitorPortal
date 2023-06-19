import {
    Box,
    HStack,
    useRadio,
    UseRadioProps,
    useRadioGroup,
    Text,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';

interface CustomRadioProps extends UseRadioProps {
    children: ReactNode;
}

const CustomRadio: React.FC<CustomRadioProps> = (props) => {
    const { getInputProps, getRadioProps } = useRadio(props);

    const input = getInputProps();
    const checkbox = getRadioProps();

    return (
        <Box as="label">
            <input {...input} />
            <Box
                {...checkbox}
                cursor="pointer"
                borderWidth={2}
                borderRadius="md"
                boxShadow="md"
                _checked={{ bg: 'blue.500', color: 'white', borderColor: 'blue.300' }}
                _focus={{ boxShadow: 'outline' }}
                p={2}
                px={4}
            >
                {props.children}
            </Box>
        </Box>
    );
};

interface CustomRadioGroupProps {
    defaultValue: string;
    options: string[];
    setFilterBy: (selectedValue: string) => void;
}

const ChartSwitcher: React.FC<CustomRadioGroupProps> = ({
    defaultValue,
    options,
    setFilterBy,
}) => {
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'filter',
        defaultValue,
        onChange: setFilterBy,
    });

    const group = getRootProps();

    return (
        <HStack {...group}>
            {options.map((value) => {
                const radio = getRadioProps({ value });
                return (
                    <CustomRadio key={value} {...radio}>
                        <Text>{value}</Text>
                    </CustomRadio>
                );
            })}
        </HStack>
    );
};

export default ChartSwitcher;
