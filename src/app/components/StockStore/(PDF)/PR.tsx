import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { formatDate } from "@/utils/date-helper";

// กำหนดฟอนต์ไทย
Font.register({
  family: 'Sarabun',
  fonts: [
    {
      src: '/fonts/Sarabun-Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: '/fonts/Sarabun-Light.ttf',
      fontWeight: 'normal',
    }
  ],
});

// สร้าง styles สำหรับ PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Sarabun',
  },
  documentTitle: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  headerInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 80,
    color: '#666',
  },
  infoValue: {
    flex: 1,
  },
  infoRight: {
    width: 200,
    position: 'absolute',
    right: 0,
    textAlign: 'right',
  },
  table: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#000',
    height: 400,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    fontSize: 16,
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 24,
  },
  columnItem: {  // คอลัมน์รายการที่
    width: '12%',
    borderRightWidth: 0.5,
    borderRightColor: '#000',
    padding: 4,
    textAlign: 'center',
    fontSize: 12,
  },
  columnname: {  // คอลัมน์ชื่อสินค้า
    width: '52%',
    borderRightWidth: 0.5,
    borderRightColor: '#000',
    padding: 4,
    paddingRight: 6,
    textAlign: 'center',
    fontSize: 14,
  },
  columnQty: {  // คอลัมน์จำนวน
    width: '12%',
    borderRightWidth: 0.5,
    borderRightColor: '#000',
    padding: 4,
    textAlign: 'center',
    fontSize: 12,
  },
  columnPrice: {  // คอลัมน์ราคา/หน่วย
    width: '16%',
    borderRightWidth: 0.5,
    borderRightColor: '#000',
    padding: 4,
    textAlign: 'center',
    fontSize: 12,
  },
  columnnote: {  // คอลัมน์หมายเหตุ
    width: '20%',
    padding: 4,
    textAlign: 'center',
    fontSize: 12,
  }, remarkBox: {
    marginTop: 8,
    marginBottom: 0,
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderColor: '#000',
    padding: 4,
  }, remarkLabel: {
    position: 'absolute',
    top: -8,
    left: 4,
    backgroundColor: '#fff',
    paddingHorizontal: 2,
    fontSize: 10,
    color: '#4B4B4B',
  },
  headerText: {
    fontSize: 11,
    color: '#000',
    fontWeight: 'bold',
  },
  signatureSection: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '25%',
    borderWidth: 1,
    borderColor: '#000',
    padding: 8,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginTop: 40,
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  dateLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5,
  }
});

// Props interface
interface PRProps {
  prData?: {
    pr_id: string;
    product: string;
    material: string;
    pr_states: string;
    pr_note: string;
    adddate: string;
    addby: string;
    lastupdate: string;
    updateby: string;
  };
}

const PR: React.FC<PRProps> = ({ prData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Document Title */}
        <View style={styles.documentTitle}>
          <View style={{ flex: 1 }}>
            <Text style={styles.mainTitle}>{`ใบขอซื้อ\u00A0`}</Text>
            <Text style={styles.subTitle}>{`Purchase Request (ต้นฉบับ / original)\u00A0`}</Text>
          </View>
          <Image
            src="/logo.jpg"
            style={{ width: 50, height: 'auto', alignSelf: 'flex-end' }}
          />
        </View>

        {/* Header Information */}
        <View style={styles.headerInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{`ผู้รับเงิน\u00A0`}</Text>
            <Text style={styles.infoValue}>{`: บริษัท .................................\u00A0`}</Text>
            <Text style={styles.infoRight}>{`เลขที่ / No. ${prData?.pr_id || 'PO-XXXXXXXXX'}\u00A0`}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{`ที่อยู่\u00A0`}</Text>
            <Text style={styles.infoValue}>{`: .................................................................\u00A0`}</Text>
            <Text style={styles.infoRight}>{`วันที่ / Issue ${prData?.adddate ? formatDate(prData.adddate, 'dd/MM/yyyy') : 'DD/MM/YYYY'}\u00A0`}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{`เลขประจำตัวผู้เสียภาษี\u00A0`}</Text>
            <Text style={styles.infoValue}>{`: .................................\u00A0`}</Text>
            <Text style={styles.infoRight}>{`อ้างถึง / Ref .....................\u00A0`}</Text>
          </View>
        </View>

        {/* Table Section */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.columnItem}>{`รายการที่\u00A0`}</Text>
            <Text style={styles.columnname}>{`ชื่อสินค้า\u00A0`}</Text>
            <Text style={styles.columnQty}>{`จำนวน\u00A0`}</Text>
            <Text style={styles.columnPrice}>{`ราคาต่อชิ้น\u00A0`}</Text>
            <Text style={styles.columnnote}>{`หมายเหตุ\u00A0`}</Text>
          </View>

          {/* ข้อมูลจริง */}
          {[
            { id: 1, quantity: 2, description: 'สินค้า A', price: 100, total: 200 },
            { id: 2, quantity: 1, description: 'สินค้า B', price: 150, total: 150 },
            { id: 3, quantity: 3, description: 'สินค้า C', price: 200, total: 600 },
            { id: 4, quantity: 5, description: 'สินค้า D', price: 50, total: 250 },
            { id: 5, quantity: 4, description: 'สินค้า E', price: 75, total: 300 },
          ].map((product) => (
            <View key={product.id} style={[styles.tableRow, { borderBottomWidth: 0.5, borderBottomColor: '#000' }]}>
              <Text style={[styles.columnItem, { textAlign: 'center', fontSize: 10 }]}>{product.id}</Text>
              <Text style={[styles.columnname, { textAlign: 'left', fontSize: 10 }]}>{product.description}</Text>
              <Text style={[styles.columnQty, { textAlign: 'center', fontSize: 10 }]}>{product.quantity}</Text>
              <Text style={[styles.columnPrice, { textAlign: 'right', fontSize: 10 }]}>{product.price.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</Text>
              <Text style={[styles.columnnote, { textAlign: 'right', fontSize: 10 }]}>{product.total.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</Text>
            </View>
          ))}

          {/* แถวว่างที่เหลือ */}
          {[...Array(15 - 5)].map((_, index) => (
            <View key={`empty-${index}`} style={[styles.tableRow, { borderBottomWidth: 0.5, borderBottomColor: '#000' }]}>
              <Text style={styles.columnItem}></Text>
              <Text style={styles.columnname}></Text>
              <Text style={styles.columnQty}></Text>
              <Text style={styles.columnPrice}></Text>
              <Text style={styles.columnnote}></Text>
            </View>
          ))}
        </View>

        <View style={styles.remarkBox}>
          <Text style={styles.remarkLabel}>หมายเหตุ</Text>
        </View>

        {/* ส่วนลงนาม */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>{`จัดทำโดย\u00A0`}</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.dateLabel}>{`(_____/_____/_____)\u00A0`}</Text>
          </View>

          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>{`อนุมัติโดย\u00A0`}</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.dateLabel}>{`(_____/_____/_____)\u00A0`}</Text>
          </View>

          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>{`ตำแหน่งสั่งซื้อแผนกจัดซื้อ\u00A0`}</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.dateLabel}>{`สำเนาเก็บที่ผู้จัดทำ\u00A0`}</Text>
          </View>

          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>{`แผนกจัดซื้อ\u00A0`}</Text>
            <Text style={styles.signatureLabel}>{`รับวันที่ ____/____/____\u00A0`}</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.dateLabel}>{`ผู้รับเรื่อง\u00A0`}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PR;