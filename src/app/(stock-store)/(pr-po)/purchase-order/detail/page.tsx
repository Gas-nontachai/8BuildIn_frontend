"use client";
import React, { useEffect, useState } from "react";
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
    Chip
} from "@mui/material";

import { decimalFix } from "@/utils/number-helper";
import { PurchaseOrder, Unit } from "@/misc/types";
import { usePurchaseOrder, usePurchaseRequest } from "@/hooks/hooks";

const { getPurchaseOrderByID } = usePurchaseOrder();
const { getPurchaseRequestByID } = usePurchaseRequest();

const PurchaseOrderDetailPage = () => {
    const searchParams = useSearchParams();
    const purchase_order_id = searchParams.get("po_id");
    const [po, setPO] = useState<PurchaseOrder | null>(null);
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

    useEffect(() => {
        if (purchase_order_id) {
            fetchData();
        }
    }, [purchase_order_id]);

    useEffect(() => {
        if (product.length > 0) {
            console.log("product", product);
        }
        if (material.length > 0) {
            console.log("material", material);
        }
    }, [material, product]);

    const fetchData = async () => {
        try {
            const res = await getPurchaseOrderByID({ po_id: purchase_order_id || "" });
            setPO(res);
            const res_pr = await getPurchaseRequestByID({ pr_id: res.pr_id });
            setMaterial(parseJSON(res_pr.material));
            setProduct(parseJSON(res_pr.product));
        } catch (error) {
            console.error("Error fetching purchase order:", error);
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

    return (
        <Box sx={{ p: 4 }}>
            {po ? (
                <>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        หมายเลขคำขอซื้อ: {po.po_id}
                    </Typography>
                    <Chip label={`สถานะ: ${po.po_status}`} color="warning" variant="outlined" sx={{ mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                        หมายเหตุ: {po.po_note}
                    </Typography>
                    {product.length > 0 && ( // Check if product has any items
                        <Box mt={3}>
                            <Typography variant="h6">Products</Typography>
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
                                                <TableCell>{decimalFix(item.product_price)} ฿</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {material.length > 0 && ( // Check if material has any items
                        <Box mt={3}>
                            <Typography variant="h6">Materials</Typography>
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
                                                <TableCell>{decimalFix(item.material_price)} ฿</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </>
            ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
};

export default PurchaseOrderDetailPage;
