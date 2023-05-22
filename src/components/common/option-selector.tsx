import React, { FC, useState, useCallback } from 'react';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { RiArrowDropDownLine } from 'react-icons/ri';

interface OptionSelectorProps {
    options: string[];
    defaultOption: string;
    onSelect?: (value: string) => void;
}

const OptionSelector: FC<OptionSelectorProps> = ({ options, defaultOption, onSelect }) => {
    const [selectedOption, setSelectedOption] = useState(defaultOption);

    const handleSelect = useCallback(
        (value: string) => {
            setSelectedOption(value);
            onSelect && onSelect(value);
        },
        [onSelect]
    );

    return (
        <Menu>
            <MenuButton as={Button} colorScheme="green" rightIcon={<RiArrowDropDownLine />}>
                {selectedOption}
            </MenuButton>
            <MenuList>
                {options.map((option) => (
                    <MenuItem key={option} onClick={() => handleSelect(option)}>
                        {option}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};

export default OptionSelector;
