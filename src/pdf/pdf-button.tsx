import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocument from './pdf-document';
import { IconButton, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { IProperty, IUnit } from '../utils/interfaces/typings';
import { IDatePrice } from '../services/calendar-service';
import { FaFilePdf } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface PDFButtonProps {
    property: IProperty | null;
    unit: IUnit | null;
    datePrices: IDatePrice[];
}

const PDFButton: React.FC<PDFButtonProps> = ({ property, unit, datePrices }) => {
    const { t } = useTranslation();

    if (!property || !unit || !datePrices) {
        return (
            <Tooltip
                hasArrow
                label={t('Select property and unit to download prices')}
                placement="bottom-start"
            >
                <IconButton
                    isDisabled={true}
                    colorScheme="blue"
                    aria-label={t('Download prices')}
                    as="a"
                    icon={<FaFilePdf />}
                />
            </Tooltip>
        );
    }

    return (
        <PDFDownloadLink
            document={
                <PDFDocument property={property} unit={unit} datePrices={datePrices} />
            }
            fileName={`${unit?.name}_date_prices.pdf`}
        >
            {({ url, loading, error }) => (
                <Tooltip hasArrow label={t('Download your prices in PDF document')}>
                    <IconButton
                        aria-label="Download prices"
                        as="a"
                        icon={<FaFilePdf />}
                        href={url ?? ''}
                        download={!loading}
                        isLoading={loading}
                        colorScheme={error ? 'red' : 'blue'}
                    />
                </Tooltip>
            )}
        </PDFDownloadLink>
    );
};

export default PDFButton;
