import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Employee, Product } from '@/misc/types';


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
        marginTop: 5,
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
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#000',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#fff',  // เปลี่ยนเป็นพื้นขาว
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    tableRow: {
        flexDirection: 'row',
        minHeight: 24,  // กำหนดความสูงขั้นต่ำของแถว
    },
    columnNo: {  // คอลัมน์ลำดับ
        width: '8%',
        borderRightWidth: 1,
        borderRightColor: '#000',
        padding: 4,
        textAlign: 'center',
    },
    columnItem: {  // คอลัมน์รายการ
        width: '52%',
        borderRightWidth: 1,
        borderRightColor: '#000',
        padding: 4,
    },
    columnPrice: {  // คอลัมน์ราคา/หน่วย
        width: '16%',
        borderRightWidth: 1,
        borderRightColor: '#000',
        padding: 4,
        textAlign: 'right',
    },
    columnQty: {  // คอลัมน์จำนวน
        width: '12%',
        borderRightWidth: 1,
        borderRightColor: '#000',
        padding: 4,
        textAlign: 'center',
    },
    columnTotal: {  // คอลัมน์ยอดรวม
        width: '20%',
        padding: 4,
        textAlign: 'right',
    },
    totalSection: {
        marginTop: 4,
        paddingTop: 0,
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 10,
    },
    remarkBox: {
        marginTop: 8,
        marginBottom: 0,
        width: '100%',
        height: 60,
        borderWidth: 1,
        borderColor: '#000',
        padding: 4,
    },
    remarkLabel: {
        position: 'absolute',
        top: -8,
        left: 4,
        backgroundColor: '#fff',
        paddingHorizontal: 2,
        fontSize: 10,
        color: '#4B4B4B',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        padding: 4,
    },
    totalLastRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 4,
    },
    totalLabel: {
        textAlign: 'right',
        paddingRight: 10,
        color: '#4B4B4B',
        flex: 1,
        fontSize: 10,
    },
    totalAmount: {
        width: 120,
        textAlign: 'right',
        fontWeight: 'normal',
        fontSize: 10,
    },
    signatureSection: { // กล่องลงนาม
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 1, // ระยะห่างด้านบน
        marginBottom: 20, // ระยะห่างด้านล่าง
    },
    signatureBox: {
        width: '33%',
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        alignItems: 'center', // จัดให้อยู่ตรงกลาง
    },
    signatureLine: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        width: '80%', // ความกว้างของเส้น
        marginVertical: 5, // ระยะห่างด้านบนและด้านล่าง
    },
    signatureLabel: {
        fontSize: 10,
        textAlign: 'center',
    },
    signatureTitle: {
        fontSize: 10,
        marginBottom: 5, // ระยะห่างด้านล่าง
    },
    paymentBox: {
        width: '33%',
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10, // ระยะห่างด้านล่าง
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 1, // ระยะห่างด้านบน
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5, // ระยะห่างด้านล่าง
    },
    checkbox: {
        width: 10,
        height: 10,
        borderWidth: 1, 
        borderColor: '#000',
        marginRight: 5, // ระยะห่างด้านขวา
    },
    paymentDetail: {
        marginTop: 5, // ระยะห่างด้านบน
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

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.columnNo}>ลำดับ</Text>
                        <Text style={styles.columnItem}>รายการ</Text>
                        <Text style={styles.columnPrice}>ราคา/ชิ้น</Text>
                        <Text style={styles.columnQty}>จำนวน</Text>
                        <Text style={styles.columnTotal}>ยอดรวม</Text>
                    </View>

                    {products.map((product, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.columnNo}>{index + 1}</Text>
                            <Text style={styles.columnItem}>{product.product_name}</Text>
                            <Text style={styles.columnPrice}>
                                {Number(product.product_price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                            </Text>
                            <Text style={styles.columnQty}>{product.quantity}</Text>
                            <Text style={styles.columnTotal}>
                                {product.total.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                            </Text>
                        </View>
                    ))}

                    {/* เพิ่มแถวว่างเพื่อให้ตารางดูยาวขึ้น */}
                    {[...Array(10 - products.length)].map((_, index) => (
                        <View key={`empty-${index}`} style={styles.tableRow}>
                            <Text style={styles.columnNo}></Text>
                            <Text style={styles.columnItem}></Text>
                            <Text style={styles.columnPrice}></Text>
                            <Text style={styles.columnQty}></Text>
                            <Text style={styles.columnTotal}></Text>
                        </View>
                    ))}
                </View>

                {/* Remark Section */}
                <View style={styles.remarkBox}>
                    <Text style={styles.remarkLabel}>หมายเหตุ</Text>
                </View>

                {/* Total Section */}
                <View style={styles.totalSection}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>จำนวนรายการทั้งหมด:</Text>
                        <Text style={styles.totalAmount}>{products.length} รายการ</Text>
                    </View>
                    <View style={styles.totalLastRow}>
                        <Text style={styles.totalLabel}>ยอดรวมทั้งสิ้น:</Text>
                        <Text style={styles.totalAmount}>
                            ฿ {totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                        </Text>
                    </View>
                </View>

                {/* Signature Section */}
                <View style={styles.signatureSection}>
                    {/* กล่องที่ 1: ลงนามสำนักงาน */}
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureTitle}>สำนักงานใหญ่</Text>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureLabel}>ผู้มีอำนาจลงนาม</Text>
                    </View>

                    {/* กล่องที่ 2: จัดเตรียมและตรวจสอบ */}
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureTitle}>จัดเตรียมโดย</Text>
                        <View style={styles.signatureLine} />
                        <Text style={[styles.signatureTitle, { marginTop: 20 }]}>ตรวจสอบโดย</Text>
                        <View style={styles.signatureLine} />
                    </View>

                    {/* กล่องที่ 3: การชำระเงิน */}
                    <View style={styles.paymentBox}>
                        <View style={styles.paymentHeader}>
                            <Text style={styles.signatureTitle}>ชำระโดย</Text>
                            <View style={styles.checkboxRow}>
                                <View style={styles.checkbox} />
                                <Text style={{ fontSize: 10 }}>เงินสด</Text>
                            </View>
                            <View style={styles.checkboxRow}>
                                <View style={styles.checkbox} />
                                <Text style={{ fontSize: 10 }}>เช็ค</Text>
                            </View>
                        </View>
                        
                        <Text style={{ fontSize: 10, marginTop: 10 }}>ธนาคาร: _________________</Text>
                        <View style={styles.paymentRow}>
                            <Text style={{ fontSize: 10 }}>เลขที่: _________</Text>
                            <Text style={{ fontSize: 10 }}>วันที่: _________</Text>
                        </View>
                        
                        <Text style={[styles.signatureLabel, { marginTop: 15, textAlign: 'center' }]}>ผู้รับเงิน</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default Quotation;