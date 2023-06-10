import React from 'react';
import ReactPDF, { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { IProperty, IUnit } from '../utils/interfaces/typings';
import { IDatePrice } from '../services/calendar-service';
import { format } from 'date-fns';
import opensans from '../assets/fonts/opensans.ttf';

import Font = ReactPDF.Font;
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
        backgroundColor: '#E6E8EB',
        padding: '16px',
    },
    header: {
        fontSize: 24,
        marginBottom: '16px',
        fontWeight: 'bold',
        color: '#000',
    },
    subheader: {
        fontSize: 18,
        marginBottom: '12px',
        fontWeight: 'semibold',
        color: '#333',
    },
    text: {
        fontFamily: 'Open Sans',
        fontSize: 14,
        marginBottom: '8px',
        color: '#333',
    },
    tag: {
        fontFamily: 'Open Sans',
        fontSize: 12,
        padding: '2px 4px',
        borderRadius: '3px',
        backgroundColor: '#3182CE',
        color: '#fff',
        marginTop: '2px',
        marginBottom: '4px',
    },
    row: {
        flexDirection: 'row',
        marginBottom: '10px',
        alignItems: 'center',
    },
    column: {
        flexDirection: 'column',
        flexGrow: 1,
    },
    border: {
        border: '1px solid #B0B3B8',
        padding: '4px',
        borderRadius: '3px',
        backgroundColor: '#fff',
    },
});

const formatDate = (date: Date) => format(date, 'dd.MM');

const PDFDocument: React.FC<IPDFProps> = ({ property, unit, datePrices }) => {
    datePrices.sort((a, b) => a.date_range[0].getTime() - b.date_range[0].getTime());
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Property Information</Text>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.subheader}>Property Details:</Text>
                        <Text style={styles.text}>Property: {property?.name}</Text>
                        <View style={styles.row}>
                            <Text style={[styles.tag, { marginRight: '8px' }]}>
                                Location: {property?.location}
                            </Text>
                            <Text style={styles.tag}>Type: {property?.type}</Text>
                        </View>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.subheader}>Unit Details:</Text>
                        <Text style={styles.text}>Unit: {unit?.name}</Text>
                        <Text style={styles.text}>Capacity: {unit?.capacity}</Text>
                    </View>
                </View>
                <Text style={styles.subheader}>Date Prices:</Text>
                {datePrices.map((datePrice, index) => (
                    <View key={index} style={[styles.row, styles.border]}>
                        <Text>
                            {formatDate(datePrice.date_range[0])} -{' '}
                            {formatDate(datePrice.date_range[1])} - {datePrice.price}€
                        </Text>
                    </View>
                ))}
            </Page>
        </Document>
    );
};

export default PDFDocument;
