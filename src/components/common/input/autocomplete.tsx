import React from 'react';
import Select, { SingleValue } from 'react-select';
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

export const mapValueToLabel = <T extends IEntity>(entity: T | null): ILabel | null => {
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
    onSelect: (newValue: SingleValue<ILabel>) => void;
    isDisabled?: boolean;
    width?: Property.Width<string | number>;
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
            onChange={onSelect}
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
                    width: width,
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
