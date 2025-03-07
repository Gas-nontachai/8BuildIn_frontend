import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Employee, Product } from '@/misc/types';
import { decimalFix } from '@/utils/number-helper';

// ลงทะเบียนฟอนต์ไทย
Font.register({
    family: 'Sarabun',
    fonts: [
        {
            src: 'https://cdn.jsdelivr.net/npm/@fontsource/sarabun@4.5.0/files/sarabun-all-400-normal.woff',
            fontWeight: 'normal'
        },
        {
            src: 'https://cdn.jsdelivr.net/npm/@fontsource/sarabun@4.5.0/files/sarabun-all-700-normal.woff',
            fontWeight: 'bold'
        }
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 14,
        fontFamily: 'Sarabun',
    },
    header: {
        marginBottom: 30,
    },
    brandName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2B3674',
        marginBottom: 5,
    },
    documentTitle: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20,
        color: '#2B3674',
    },
    infoSection: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#F4F7FE',
    },
    infoText: {
        marginBottom: 5,
        color: '#4B4B4B',
    },
    table: {
        marginTop: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#2B3674',
        padding: 10,
        color: '#FFFFFF',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E5F2',
        padding: 10,
    },
    columnItem: {
        flex: 3,
    },
    columnPrice: {
        flex: 2,
        textAlign: 'right',
    },
    columnQty: {
        flex: 1,
        textAlign: 'center',
    },
    columnTotal: {
        flex: 2,
        textAlign: 'right',
    },
    totalSection: {
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: '#2B3674',
        paddingTop: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 5,
    },
    totalLabel: {
        textAlign: 'right',
        paddingRight: 10,
        color: '#4B4B4B',
        flex: 1,
    },
    totalAmount: {
        width: 120,
        textAlign: 'right',
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        color: '#697586',
        fontSize: 10,
    },
});

interface QuotationProps {
    employee: Employee;
    products: (Product & { quantity: string; total: number; })[];
    totalAmount: number;
}

const Quotation = ({ employee, products, totalAmount }: QuotationProps) => {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const quotationNumber = `QT-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(date.getTime()).slice(-4)}`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.brandName}>8BUILT-IN</Text>
                    <Text style={styles.documentTitle}>ใบเสนอราคา / Quotation</Text>
                </View>

                {/* Document Info */}
                <View style={styles.infoSection}>
                    <Text style={styles.infoText}>เลขที่ใบเสนอราคา: {quotationNumber}</Text>
                    <Text style={styles.infoText}>วันที่: {formattedDate}</Text>
                    <Text style={styles.infoText}>
                        ผู้ออกเอกสาร: {employee.employee_prefix}{employee.employee_firstname} {employee.employee_lastname}
                    </Text>
                    {/* <Text style={styles.infoText}>ตำแหน่ง: {employee.license_name}</Text> */}
                </View>

                {/* Products Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.columnItem}>รายการสินค้า</Text>
                        <Text style={styles.columnPrice}>ราคา/หน่วย</Text>
                        <Text style={styles.columnQty}>จำนวน</Text>
                        <Text style={styles.columnTotal}>ราคารวม</Text>
                    </View>

                    {products.map((product, index) => (
                        <View key={index} style={[
                            styles.tableRow,
                            { backgroundColor: index % 2 === 0 ? '#F8F9FF' : '#FFFFFF' }
                        ]}>
                            <Text style={styles.columnItem}>{product.product_name}</Text>
                            <Text style={styles.columnPrice}>{Number(product.product_price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</Text>
                            <Text style={styles.columnQty}>{product.quantity}</Text>
                            <Text style={styles.columnTotal}>{product.total.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</Text>
                        </View>
                    ))}
                </View>

                {/* Total Section */}
                <View style={styles.totalSection}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>จำนวนรายการทั้งหมด:</Text>
                        <Text style={styles.totalAmount}>{products.length} รายการ</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>ยอดรวมทั้งสิ้น:</Text>
                        <Text style={styles.totalAmount}>
                            ฿ {totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    เอกสารนี้ออกโดยระบบอัตโนมัติ - This is a computer-generated document
                </Text>
            </Page>
        </Document>
    );
};

export default Quotation;