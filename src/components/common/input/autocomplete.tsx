import React from 'react';
import {
    ActionMeta,
    components,
    OptionProps,
    SingleValue,
    SingleValueProps,
    Select,
} from 'chakra-react-select';
import { Property } from 'csstype';
import { observer } from 'mobx-react-lite';
import { HStack, Text } from '@chakra-ui/react';

export interface ILabel {
    value: string;
    label: string;
}

export interface IEntity {
    id: string;
    name: string;
}

export const mapToAutocompleteLabels = <T extends IEntity>(entities: T[]): ILabel[] => {
    return entities.map((entity) => {
        return {
            value: entity.id,
            label: entity.name,
        };
    });
};

export const mapValueToLabel = <T extends IEntity>(entity: T | null | undefined): ILabel | null => {
    if (!entity) {
        return null;
    }

    return {
        value: entity.id,
        label: entity.name,
    };
};

const { Option, SingleValue: SingleValueComponent } = components;
const CustomOption: React.FC<OptionProps<ILabel, false>> = ({ children, ...props }) => (
    <Option {...props}>
        <HStack>
            <img
                src={`https://flagcdn.com/${props.data.value.toLowerCase()}.svg`}
                alt={props.data.label}
                width="16"
            />
            <Text>{children}</Text>
        </HStack>
    </Option>
);

const CustomSingleValue: React.FC<SingleValueProps<ILabel>> = ({ children, ...props }) => (
    <SingleValueComponent {...props}>
        <HStack>
            <img
                src={`https://flagcdn.com/${props.data.value.toLowerCase()}.svg`}
                alt={props.data.label}
                width="16"
            />
            <Text>{children}</Text>
        </HStack>
    </SingleValueComponent>
);

interface AutocompleteProps {
    placeholder: string;
    value: ILabel | null;
    options: ILabel[];
    isLoading?: boolean;
    onSelect: (newValue: SingleValue<ILabel>, actionMeta?: ActionMeta<ILabel>) => void;
    isDisabled?: boolean;
    width?: Property.Width<string | number>;
    flags?: boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
    placeholder,
    value,
    options,
    isLoading,
    onSelect,
    isDisabled,
    width,
    flags,
}) => {
    return (
        <Select
            size="md"
            colorScheme="blue"
            onChange={(value, actionMeta) => onSelect(value as SingleValue<ILabel>, actionMeta)}
            value={value}
            chakraStyles={{
                container: (provided) => ({
                    ...provided,
                    width: width,
                }),
            }}
            placeholder={placeholder}
            options={options}
            isLoading={isLoading}
            isDisabled={isDisabled}
        />
    );
};

export default observer(Autocomplete);
