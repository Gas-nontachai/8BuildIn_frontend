import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { formatDate } from "@/utils/date-helper";
import { PurchaseOrder } from "@/misc/purchase-order";


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
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subTitle: {
    // fontSize: 14,
    // color: '#666',
    // marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 70,
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
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#000',
    height: 435,
    display: 'flex',
    flexDirection: 'column',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    fontSize: 16,
  },
  tableItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    minHeight: 30,
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 20,
    borderBottomWidth: 0.5, // เส้นระหว่างแถว
    // borderBottomColor: '#000',
  },
  columnItem: {
    width: '13%',
    borderRightWidth: 0.5,
    borderRightColor: '#000',
    paddingVertical: 2,
    paddingHorizontal: 4,
    textAlign: 'center',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // columnCode: {
  //   width: '25%',
  //   borderRightWidth: 0.5,
  //   borderRightColor: '#000',
  //   paddingVertical: 1,
  //   paddingHorizontal: 4,
  //   textAlign: 'center',
  //   fontSize: 12,
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  columnname: {
    width: '57%',
    borderRightWidth: 0.5,
    borderRightColor: '#000',
    paddingVertical: 1,
    paddingHorizontal: 4,
    textAlign: 'center',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  columnQty: {
    width: '15%',
    borderRightWidth: 0.5,
    borderRightColor: '#000',
    paddingVertical: 1,
    textAlign: 'center',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnnote: {
    width: '15%',
    paddingVertical: 1,
    textAlign: 'center',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remarkBox: {
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
  columProducts: {  // คอลัมน์ชื่อสินค้า
    width: '100%',
    padding: 4,
    paddingRight: 6,
    textAlign: 'center',
    fontSize: 14,
  },
  columMaterials: {  // คอลัมน์ชื่อสินค้า
    width: '100%',
    padding: 4,
    paddingRight: 6,
    textAlign: 'center',
    fontSize: 14,
  },
  remarkValue: {
    width: '100%',
    height: 60,
  },
  headerText: {
    fontSize: 11,
    color: '#000',
    fontWeight: 'bold',
  },
  signatureSection: {
    position: 'absolute',
    height: 100,
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '24.5%',
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
interface POProps {
    purchaseOrder: PurchaseOrder;
}

const PO: React.FC<POProps> = ({ purchaseOrder }) => {
  const materials = JSON.parse(purchaseOrder.material || '[]');
  const products = JSON.parse(purchaseOrder.product || '[]');

  // สร้าง Component สำหรับแสดงเนื้อหาในแต่ละหน้า
  const PageContent = ({ items, type, pageNumber }: { items: any[], type: 'product' | 'material', pageNumber: number }) => (
    <Page size="A4" style={styles.page}>
      {/* Document Title */}
      <View style={[styles.documentTitle, { flexDirection: 'row' }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.mainTitle}>
            {`ใบขอซื้อ - ${type === 'product' ? '(สินค้า)' : '(วัสดุ) '}`}
          </Text>
          <Text style={styles.subTitle}>
            {`Purchase Request - ${type === 'product' ? '(Products)' : '(Materials)'}`}
          </Text>
        </View>
        <View>
          <Image
            src="/logo.jpg"
            style={{ width: 50, height: 'auto', alignSelf: 'flex-end' }}
          />
        </View>
      </View>

      {/* Header Information */}
      <View style={styles.headerInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{`ผู้จัดจำหน่าย\u00A0`}</Text>
          <Text style={styles.infoValue}>{`: ${purchaseOrder?.supplier_id || '....................................................................................\u00A0'}`}</Text>
          <Text style={styles.infoRight}>{`เลขที่ / No. ${purchaseOrder?.po_id || '-'}\u00A0`}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{`ที่อยู่\u00A0`}</Text>
          <Text style={styles.infoValue}>{`: ....................................................................................\u00A0`}</Text>
          <Text style={styles.infoRight}>{`วันที่ / Issue ${purchaseOrder?.adddate ? formatDate(purchaseOrder.adddate, 'dd/MM/yyyy') : 'DD/MM/YYYY'}\u00A0`}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{`ผู้รับผิดชอบ\u00A0`}</Text>
          <Text style={styles.infoValue}>{`: ${purchaseOrder?.updateby || purchaseOrder?.addby || '....................................................................................'}\u00A0`}</Text>
          <Text style={styles.infoRight}>{`เบอร์โทร / Tel .....................\u00A0`}</Text>
        </View>
      </View>

      {/* Table Section */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.columnItem}>{`รายการที่\u00A0`}</Text>
          {/* <Text style={styles.columnCode}>{`รหัสสินค้า\u00A0`}</Text> */}
          <Text style={styles.columnname}>{`ชื่อ${type === 'product' ? 'สินค้า' : 'วัสดุ'}\u00A0`}</Text>
          <Text style={styles.columnQty}>{`จำนวน\u00A0`}</Text>
          <Text style={styles.columnnote}>{`หมายเหตุ\u00A0`}</Text>
        </View>

        {items.map((item: any, index: number) => (
          <View key={`${type}-${index}`} style={styles.tableRow}>
            <Text style={[styles.columnItem, { textAlign: 'center', fontSize: 10 }]}>{index + 1}</Text>
            {/* <Text style={[styles.columnCode, { textAlign: 'center' }]}>{`${item.unit_id}`}</Text> */}
            <Text style={[styles.columnname, { textAlign: 'left', fontSize: 10 }]}>
              {`${type === 'product' ? item.product_name : item.material_name}\u00A0`}
            </Text>
            <Text style={[styles.columnQty, { textAlign: 'center', fontSize: 10 }]}>
              {`${type === 'product' ? item.product_quantity : item.material_quantity}\u00A0`}
            </Text>
            <Text style={[styles.columnnote, { textAlign: 'center', fontSize: 10 }]}>{''}</Text>
          </View>
        ))}

        {/* แถวว่างที่เหลือ */}
        {[...Array(Math.max(0, 20 - items.length))].map((_, index) => (
          <View key={`empty-${index}`} style={styles.tableRow}>
            <Text style={styles.columnItem}>{'\u00A0'}</Text>
            {/* <Text style={styles.columnCode}>{'\u00A0'}</Text> */}
            <Text style={styles.columnname}>{'\u00A0'}</Text>
            <Text style={styles.columnQty}>{'\u00A0'}</Text>
            <Text style={styles.columnnote}>{'\u00A0'}</Text>
          </View>
        ))}
      </View>

      <View style={styles.remarkBox}>
        <Text style={styles.remarkLabel}>หมายเหตุ</Text>
        <Text style={styles.remarkValue}>{`${purchaseOrder?.po_note || ''}`}</Text>
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

      {/* เลขหน้า */}
      <Text style={{
        position: 'absolute',
        bottom: 30,
        right: 40,
        fontSize: 10,
      }}>{`หน้า ${pageNumber}`}</Text>
    </Page>
  );

  return (
    <Document>
      {products.length > 0 && (
        <PageContent items={products} type="product" pageNumber={1} />
      )}
      {materials.length > 0 && (
        <PageContent items={materials} type="material" pageNumber={products.length > 0 ? 2 : 1} />
      )}
    </Document>
  );
};

export default PO;