import React from 'react';
import Select, {
    ActionMeta,
    components,
    OptionProps,
    SingleValue,
    SingleValueProps,
} from 'react-select';
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
            components={
                flags ? { Option: CustomOption, SingleValue: CustomSingleValue } : undefined
            }
            onChange={(value, actionMeta) => onSelect(value as SingleValue<ILabel>, actionMeta)}
            value={value}
            theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary25: '#e3eeff',
                    primary: '#3182CE',
                },
            })}
            styles={{
                control: (base) => ({
                    ...base,
                    width: isLoading ? 'max-content' : width,
                    borderColor: '#E2E8F0',
                    borderRadius: '5px',
                    boxShadow: '0 0 0 1px #CBD5E0',
                    '&:hover': {
                        borderColor: '#CBD5E0',
                    },
                }),
                menu: (provided) => ({
                    ...provided,
                    color: 'black',
                    backgroundColor: '#F7FAFC',
                    borderRadius: '5px',
                }),
                singleValue: (provided) => ({
                    ...provided,
                    color: '#2D3748',
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
