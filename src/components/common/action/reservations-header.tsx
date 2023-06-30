import React from 'react';
import { SingleValue } from 'react-select';
import { IoBook } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import Autocomplete, {
    ILabel,
    mapToAutocompleteLabels,
    mapValueToLabel,
} from '../input/autocomplete';
import TooltipIconButton from '../tooltip-icon-button';
import { IProperty, IUnit } from '../../../utils/interfaces/typings';
import { Divider } from '@chakra-ui/react';

interface ReservationActionsProps {
    onSelectProperty: (newValue: SingleValue<ILabel>) => void;
    onSelectUnit: (newValue: SingleValue<ILabel>) => void;
    selectedUnit: IUnit | null;
    label: string;
    onAddReservationClick: () => void;
    isFetching: boolean;
    currentProperty: IProperty | null;
    properties: IProperty[];
    autocompleteWidth?: string;
    hasDivider?: boolean;
}

const ReservationActions: React.FC<ReservationActionsProps> = (props) => {
    const { t } = useTranslation();

    return (
        <>
            <Autocomplete
                value={mapValueToLabel(props.currentProperty)}
                onSelect={props.onSelectProperty}
                placeholder={t('Select property')}
                options={mapToAutocompleteLabels(props.properties)}
                isLoading={props.isFetching}
                width={props.autocompleteWidth ? props.autocompleteWidth : '16rem'}
            />
            <Autocomplete
                value={mapValueToLabel(props.selectedUnit)}
                onSelect={props.onSelectUnit}
                placeholder={t('Select unit')}
                options={mapToAutocompleteLabels(props.currentProperty?.units ?? [])}
                isDisabled={!props.currentProperty}
                width={props.autocompleteWidth ? props.autocompleteWidth : '14rem'}
            />
            {props.hasDivider && <Divider my={2} />}
            <TooltipIconButton
                hasArrow={true}
                placement="bottom-start"
                label={props.label}
                ariaLabel="Add reservation"
                colorScheme="orange"
                onClick={props.onAddReservationClick}
                icon={<IoBook />}
            />
        </>
    );
};

export default ReservationActions;
