import React from 'react';
import { ActionMeta, SingleValue, Select } from 'chakra-react-select';
import { Property } from 'csstype';
import { observer } from 'mobx-react-lite';

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
}) => {
    return (
        <Select
            size="md"
            colorScheme="blue"
            onChange={(value, actionMeta) => onSelect(value, actionMeta)}
            value={value}
            chakraStyles={{
                container: (provided) => ({
                    ...provided,
                    width: isLoading ? 'fit-content' : width,
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
