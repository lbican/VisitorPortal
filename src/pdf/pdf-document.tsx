import React from 'react';
import ReactPDF, { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { IProperty, IUnit } from '../utils/interfaces/typings';
import { IDatePrice } from '../services/calendar-service';
import { format, differenceInDays } from 'date-fns';
import opensans from '../assets/fonts/opensans.ttf';

import Font = ReactPDF.Font;
import { useTranslation } from 'react-i18next';

interface IPDFProps {
    property: IProperty | undefined;
    unit: IUnit | null;
    datePrices: IDatePrice[];
}

Font.register({
    family: 'Open Sans',
    src: opensans,
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#EDF2F7',
        padding: '16px',
    },
    header: {
        fontSize: 24,
        marginBottom: '16px',
        fontWeight: 'bold',
        color: '#2D3748',
    },
    subheader: {
        fontSize: 20,
        marginBottom: '12px',
        fontWeight: 'bold',
        color: '#2D3748',
    },
    text: {
        fontFamily: 'Open Sans',
        fontSize: 14,
        marginBottom: '8px',
        color: '#4A5568',
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '10px',
    },
    column: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    datePriceContainer: {
        border: '1px solid #E2E8F0',
        borderRadius: '5px',
        backgroundColor: '#fff',
        marginBottom: '8px',
        padding: '4px',
    },
    datePrice: {
        fontFamily: 'Open Sans',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 12,
        color: '#2D3748',
    },
    datePriceElement: {
        width: '33,3333%',
    },
});

const formatDate = (date: Date) => format(date, 'dd.MM.yyyy');

const PDFDocument: React.FC<IPDFProps> = ({ property, unit, datePrices }) => {
    const { t } = useTranslation();
    datePrices.sort((a, b) => a.date_range[0].getTime() - b.date_range[0].getTime());

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>{t('Property Information')}</Text>
                <View style={styles.details}>
                    <View style={styles.column}>
                        <Text style={styles.subheader}>{t('Property')}</Text>
                        <Text style={styles.text}>
                            {t('propertyName', { propertyName: property?.name })}
                        </Text>
                        <Text style={styles.text}>
                            {t('propertyLocation', { propertyLocation: property?.location })}
                        </Text>
                        <Text style={styles.text}>
                            {t('propertyType', { propertyType: property?.type })}
                        </Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.subheader}>{t('Unit')}</Text>
                        <Text style={styles.text}>
                            {t('propertyUnit', { propertyUnit: unit?.name })}
                        </Text>
                        <Text style={styles.text}>
                            {t('unitCapacity', { unitCapacity: unit?.capacity })}
                        </Text>
                    </View>
                </View>
                <Text style={styles.subheader}>{t('Price List')}</Text>
                {datePrices.map((datePrice, index) => {
                    const nights = differenceInDays(
                        datePrice.date_range[1],
                        datePrice.date_range[0]
                    );
                    return (
                        <View key={index} style={styles.datePriceContainer}>
                            <View style={styles.datePrice}>
                                <Text style={styles.datePriceElement}>{`${formatDate(
                                    datePrice.date_range[0]
                                )} - ${formatDate(datePrice.date_range[1])}`}</Text>
                                <Text style={styles.datePriceElement}>{`${nights} ${
                                    nights > 1 ? t('nights') : t('night')
                                }`}</Text>
                                <Text style={styles.datePriceElement}>{`${datePrice.price}€`}</Text>
                            </View>
                        </View>
                    );
                })}
            </Page>
        </Document>
    );
};

export default PDFDocument;
