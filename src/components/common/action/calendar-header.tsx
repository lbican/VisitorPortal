import React from 'react';
import { SingleValue } from 'react-select';
import { useTranslation } from 'react-i18next';
import Autocomplete, {
    ILabel,
    mapToAutocompleteLabels,
    mapValueToLabel,
} from '../input/autocomplete';
import { IProperty, IUnit } from '../../../utils/interfaces/typings';
import { IDatePrice } from '../../../services/calendar-service';
import { Divider, HStack } from '@chakra-ui/react';
import TooltipIconButton from '../tooltip-icon-button';
import { IoBook, IoPricetag } from 'react-icons/io5';
import PDFButton from '../../../pdf/pdf-button';

interface CalendarActionsProps {
    onSelectProperty: (newValue: SingleValue<ILabel>) => void;
    onSelectUnit: (newValue: SingleValue<ILabel>) => void;
    selectedUnit: IUnit | null;
    onPriceModalOpen: () => void;
    onReservationModalOpen: () => void;
    datesSelected: boolean;
    isFetching: boolean;
    unitPrices: IDatePrice[];
    currentProperty: IProperty | null;
    properties: IProperty[];
    autocompleteWidth?: string;
    hasDivider?: boolean;
    onCloseDrawer?: () => void;
}

const CalendarActions: React.FC<CalendarActionsProps> = (props) => {
    const { t } = useTranslation();

    return (
        <>
            <Autocomplete
                value={mapValueToLabel(props.currentProperty)}
                onSelect={props.onSelectProperty}
                placeholder={t('Select property') ?? ''}
                options={mapToAutocompleteLabels<IProperty>(props.properties)}
                isLoading={props.isFetching}
                width={props.autocompleteWidth ? props.autocompleteWidth : '16rem'}
            />
            <Autocomplete
                value={mapValueToLabel(props.selectedUnit)}
                onSelect={props.onSelectUnit}
                placeholder={t('Select unit') ?? ''}
                options={mapToAutocompleteLabels<IUnit>(props.currentProperty?.units ?? [])}
                isDisabled={!props.currentProperty}
                width={props.autocompleteWidth ? props.autocompleteWidth : '14rem'}
            />
            {props.hasDivider && <Divider my={2} />}
            <HStack>
                <TooltipIconButton
                    hasArrow={true}
                    label={
                        props.datesSelected
                            ? t('Assign price')
                            : t('Select date range to assign prices')
                    }
                    ariaLabel="Assign price"
                    colorScheme="green"
                    onClick={props.onPriceModalOpen}
                    icon={<IoPricetag />}
                    isDisabled={!props.datesSelected}
                    placement="bottom-start"
                />
                <TooltipIconButton
                    hasArrow={true}
                    placement="bottom-start"
                    label={
                        props.datesSelected
                            ? t('Add new reservation')
                            : t('Select date range to add reservation')
                    }
                    ariaLabel="Add reservation"
                    colorScheme="orange"
                    onClick={() => {
                        props.onCloseDrawer && props.onCloseDrawer();
                        props.onReservationModalOpen();
                    }}
                    icon={<IoBook />}
                    isDisabled={!props.datesSelected}
                />
                <PDFButton
                    property={props.currentProperty}
                    unit={props.selectedUnit}
                    datePrices={props.unitPrices}
                />
            </HStack>
        </>
    );
};

export default CalendarActions;
