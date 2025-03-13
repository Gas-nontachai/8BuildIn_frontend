"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import { useSearchParams } from "next/navigation";
import {
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    CircularProgress,
    Box,
    Button,
    Breadcrumbs,
    Link,
    Stack,
    Grid,
    Tooltip,
    TextField,
    Divider,
    MenuItem,
    Select,
    FormLabel,
    FormControl
} from "@mui/material";
import { FirstPage, ReceiptLong } from "@mui/icons-material";

import Loading from "@/app/components/Loading";

import { decimalFix } from "@/utils/number-helper";
import { PurchaseOrder, Supplier } from "@/misc/types";

import { usePurchaseOrder, useSupplier } from "@/hooks/hooks";

const { getPurchaseOrderByID, updatePurchaseOrderBy } = usePurchaseOrder();
const { getSupplierBy } = useSupplier();

const PurchaseOrderDetailPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const purchase_order_id = searchParams.get("po_id");
    const [loading, setLoading] = useState(false)
    const [po, setPO] = useState<PurchaseOrder>({
        po_id: "",
        pr_id: "",
        supplier_id: "",
        po_status: "",
        po_note: "",
        addby: "",
        adddate: "",
        updateby: "",
        lastupdate: ""
    });
    const [supplier, setSupplier] = useState<Supplier[]>([])
    const [PRID, setPRID] = useState('')
    const [material, setMaterial] = useState<{
        material_name: string;
        material_quantity: number;
        unit_id: string;
        material_price: number;
    }[]>([]);

    const [product, setProduct] = useState<{
        product_name: string;
        product_quantity: number;
        unit_id: string;
        product_price: number;
    }[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [Note, setNote] = useState('')

    useEffect(() => {
        if (purchase_order_id) {
            fetchData();
        }
    }, [purchase_order_id]);

    useEffect(() => {
        calculate_price();
    }, [product, material]);

    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await getPurchaseOrderByID({ po_id: purchase_order_id || "" });
            const { docs: res_sup } = await getSupplierBy()
            setSupplier(res_sup)
            setPO(res);
            setMaterial(parseJSON(res.material ?? null));
            setProduct(parseJSON(res.product ?? null));
            setPRID(res.pr_id)
            setNote(res.po_note)
        } catch (error) {
            console.error("Error fetching purchase order:", error);
        } finally {
            setLoading(false)
        }
    };

    const parseJSON = (data: string | null) => {
        try {
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Invalid JSON data:", data);
            return [];
        }
    };

    const handlePriceChange = (e: any, index: any, type: string) => {
        const updatedPrice = parseFloat(e.target.value);
        if (!isNaN(updatedPrice) && updatedPrice >= 0) {
            if (type === 'material') {
                const updatedMaterials = [...material];
                updatedMaterials[index].material_price = updatedPrice;
                setMaterial(updatedMaterials);
            } else if (type === 'product') {
                const updatedProducts = [...product];
                updatedProducts[index].product_price = updatedPrice;
                setProduct(updatedProducts);

            }
        }
    }

    const handleSubmit = async () => {
        try {
            const updatedPO = {
                ...po,
                po_id: purchase_order_id || "",
                po_status: 'buying',
                pr_id: PRID || '',
                product: JSON.stringify(product),
                material: JSON.stringify(material)
            };
            await updatePurchaseOrderBy(updatedPO);
            Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ',
                text: 'การสั่งซื้อถูกบันทึกเรียบร้อยแล้ว',
                confirmButtonText: 'ตกลง'
            });
            router.push('/pr-po-list');
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกการสั่งซื้อได้',
                confirmButtonText: 'ลองอีกครั้ง'
            });
        }
    }


    const calculate_price = () => {
        const totalProductPrice = product.reduce((sum, item) => sum + (Number(item.product_price) || 0), 0);
        const totalMaterialPrice = material.reduce((sum, item) => sum + (Number(item.material_price) || 0), 0);
        const totalPrice = totalProductPrice + totalMaterialPrice;

        setTotalPrice(totalPrice);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
                    <Link underline="hover" onClick={() => router.back()}>
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main', cursor: 'pointer' }}>
                            <FirstPage fontSize="small" />
                            <Typography variant="body1" color="primary">ย้อนกลับ</Typography>
                        </Stack>
                    </Link>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <ReceiptLong fontSize="small" />
                        <Typography variant="body1" color="text.secondary">รายละเอียดใบสั่งซื้อ</Typography>
                    </Stack>
                </Breadcrumbs>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="flex justify-between">
                        <div className="font-bold text-xl mb-2 text-gray-700">
                            หมายเลขใบสั่งซื้อ: {po.po_id}
                        </div>
                        <span className={`inline-block px-3 py-1 mb-2 rounded-md text-[14px] font-[600] shadow-md
                                ${po.po_status === "not-approved" ? "bg-red-500 text-white" :
                                po.po_status === "pending" ? "bg-yellow-500 text-white" :
                                    po.po_status === "buying" ? "bg-orange-500 text-white" :
                                        po.po_status === "success" ? "bg-green-600 text-white" : ""}`}>
                            {po.po_status === "not-approved" ? "ไม่อนุมัติ" :
                                po.po_status === "pending" ? "รอดำเนินการ" :
                                    po.po_status === "buying" ? "กำลังสั่งซื้อ" :
                                        po.po_status === "success" ? "นำเข้าสินค้าสำเร็จแล้ว" : ""}
                        </span>
                    </div>
                    <FormControl size="small" sx={{ width: '230px' }}>
                        <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>
                            เลือกผู้จัดจำหน่าย <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                            name="supplier_id"
                            size="small"
                            onChange={(e) => setPO({ ...po, supplier_id: e.target.value || "" })}
                            value={po.supplier_id || ""}
                        >
                            {supplier.map((sup) => (
                                <MenuItem key={sup.supplier_id} value={sup.supplier_id}>
                                    {sup.supplier_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <h6 className="text-[15px] font-[400] text-gray-700 mb-1 mt-5">
                        ราคารวม : {decimalFix(totalPrice)} ฿
                    </h6>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div className="mt-3 -mb-5">
                                <Divider />
                            </div>
                        </Grid>
                        {product.length > 0 && (
                            <Grid item xs={6}>
                                <Box mt={3}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>สินค้า</Typography>
                                    <TableContainer component={Paper} elevation={2}>
                                        <Table size="small">
                                            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                                                <TableRow>
                                                    <TableCell>ชื่อสินค้า</TableCell>
                                                    <TableCell>จำนวน</TableCell>
                                                    <TableCell>ราคาต่อหน่วย (บาท)</TableCell>
                                                    <TableCell>ราคารวม (บาท)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {product.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.product_name}</TableCell>
                                                        <TableCell>{item.product_quantity}</TableCell>
                                                        <TableCell>{decimalFix(item.product_price / item.product_quantity)} ฿</TableCell>
                                                        <TableCell>
                                                            {po.po_status === 'buying' || po.po_status === 'success' ? (
                                                                <Typography variant="body1">{item.product_price}</Typography>
                                                            ) : (
                                                                <TextField
                                                                    variant="outlined"
                                                                    size="small"
                                                                    value={item.product_price}
                                                                    onChange={(e) => handlePriceChange(e, index, 'product')}
                                                                />
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Grid>
                        )}

                        {material.length > 0 && (
                            <Grid item xs={6}>
                                <Box mt={3}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>วัสดุ</Typography>
                                    <TableContainer component={Paper} elevation={2}>
                                        <Table size="small">
                                            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                                                <TableRow>
                                                    <TableCell>ชื่อวัสดุ</TableCell>
                                                    <TableCell>จำนวน</TableCell>
                                                    <TableCell>ราคาต่อหน่วย (บาท)</TableCell>
                                                    <TableCell>ราคารวม (บาท)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {material.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.material_name}</TableCell>
                                                        <TableCell>{item.material_quantity}</TableCell>
                                                        <TableCell>{decimalFix(item.material_price / item.material_quantity)} ฿</TableCell>
                                                        <TableCell>
                                                            {po.po_status === 'buying' || po.po_status === 'success' ? (
                                                                <Typography variant="body1">{item.material_price}</Typography>
                                                            ) : (
                                                                <TextField
                                                                    variant="outlined"
                                                                    size="small"
                                                                    value={item.material_price}
                                                                    onChange={(e) => handlePriceChange(e, index, 'product')}
                                                                />
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Grid>
                        )}

                        <Grid item xs={12} sx={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 2 }}>
                            <TextField
                                fullWidth
                                label="หมายเหตุ"
                                multiline
                                rows={3}
                                value={Note}
                                onChange={(e) => setNote(e.target.value)}
                                variant="outlined"
                            />
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Button variant="contained" color="success" onClick={handleSubmit}>บันทึก</Button>
                                <Button variant="contained" color="info" onClick={() => router.push('/pr-po-list')}>ยกเลิก</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </>
            )
            }
        </>
    );
};

export default PurchaseOrderDetailPage;