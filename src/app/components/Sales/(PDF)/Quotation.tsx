import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define the styles for the PDF document
const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    header: {
        textAlign: 'center',
        marginBottom: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subheading: {
        fontSize: 18,
        marginTop: 10,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 15,
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 20,
        borderTop: '1px solid #000',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottom: '1px solid #000',
        paddingBottom: 5,
        fontWeight: 'bold',
    },
    tableCell: {
        width: '33%',
        padding: 5,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #000',
        paddingBottom: 5,
    },
    totalRow: {
        flexDirection: 'row',
        marginTop: 10,
        fontWeight: 'bold',
    },
    totalLabel: {
        width: '66%',
        textAlign: 'right',
        paddingRight: 10,
    },
    totalAmount: {
        width: '33%',
        textAlign: 'center',
    },
});

const Quotation = () => {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header section with company name and quotation title */}
                <View style={styles.header}>
                    <Text style={styles.heading}>Quotation</Text>
                    <Text>Quote Number: #12345</Text>
                    <Text>Date: {formattedDate}</Text>
                </View>

                {/* Vendor Information Section */}
                <View style={styles.section}>
                    <Text style={styles.subheading}>Vendor Information</Text>
                    <Text>Company Name: ABC Corporation</Text>
                    <Text>Address: 1234 Business Ave, Suite 100, City, Country</Text>
                    <Text>Email: info@abccorp.com</Text>
                    <Text>Phone: +1 (800) 123-4567</Text>
                </View>

                {/* Customer Information Section */}
                <View style={styles.section}>
                    <Text style={styles.subheading}>Customer Information</Text>
                    <Text>Customer Name: John Doe</Text>
                    <Text>Address: 5678 Residential St, City, Country</Text>
                    <Text>Email: johndoe@example.com</Text>
                    <Text>Phone: +123456789</Text>
                </View>

                {/* Products Table Section */}
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCell}>Description</Text>
                        <Text style={styles.tableCell}>Unit Price</Text>
                        <Text style={styles.tableCell}>Amount</Text>
                    </View>

                    {/* Product Rows */}
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Product A</Text>
                        <Text style={styles.tableCell}>$50.00</Text>
                        <Text style={styles.tableCell}>$50.00</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Product B</Text>
                        <Text style={styles.tableCell}>$30.00</Text>
                        <Text style={styles.tableCell}>$30.00</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Product C</Text>
                        <Text style={styles.tableCell}>$20.00</Text>
                        <Text style={styles.tableCell}>$20.00</Text>
                    </View>

                    {/* Total Row */}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalAmount}>$100.00</Text>
                    </View>
                </View>

                {/* Terms & Conditions Section */}
                <View style={styles.section}>
                    <Text style={styles.subheading}>Terms & Conditions</Text>
                    <Text>1. Prices are exclusive of taxes.</Text>
                    <Text>2. Payment due within 30 days of receipt of the quotation.</Text>
                    <Text>3. Delivery will be made within 15 working days upon order confirmation.</Text>
                </View>
            </Page>
        </Document>
    );
}

export default Quotation;
