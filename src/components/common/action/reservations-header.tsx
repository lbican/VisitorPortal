import React from 'react';
import { SingleValue } from 'react-select'; // import if needed
import { IoBook } from 'react-icons/io5'; // import if needed
import { useTranslation } from 'react-i18next';
import Autocomplete, {
    ILabel,
    mapToAutocompleteLabels,
    mapValueToLabel,
} from '../input/autocomplete';
import TooltipIconButton from '../tooltip-icon-button';
import { IProperty, IUnit } from '../../../utils/interfaces/typings'; // import if needed

interface ReservationActionsProps {
    onSelectProperty: (newValue: SingleValue<ILabel>) => void;
    onSelectUnit: (newValue: SingleValue<ILabel>) => void;
    selectedUnit: IUnit | null;
    label: string;
    onAddReservationClick: () => void;
    isFetching: boolean;
    currentProperty: IProperty | null;
    properties: IProperty[];
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
                width="16rem"
            />
            <Autocomplete
                value={mapValueToLabel(props.selectedUnit)}
                onSelect={props.onSelectUnit}
                placeholder={t('Select unit')}
                options={mapToAutocompleteLabels(props.currentProperty?.units ?? [])}
                isDisabled={!props.currentProperty}
                width="14rem"
            />
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
