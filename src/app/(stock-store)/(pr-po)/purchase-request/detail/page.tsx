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
import { PurchaseRequest, Unit } from "@/misc/types";
import { usePurchaseRequest } from "@/hooks/hooks";

const PurchaseRequestDetailPage = () => {
    const searchParams = useSearchParams();
    const purchase_request_id = searchParams.get("pr_id");
    const [pr, setPR] = useState<PurchaseRequest | null>(null);
    const { getPurchaseRequestByID } = usePurchaseRequest();

    useEffect(() => {
        if (purchase_request_id) {
            fetchData();
        }
    }, [purchase_request_id]);

    const fetchData = async () => {
        try {
            const res = await getPurchaseRequestByID({ pr_id: purchase_request_id || "" });
            setPR(res);
            console.log("data product", parseJSON(res.product));
            console.log("data material", parseJSON(res.material));
        } catch (error) {
            console.error("Error fetching purchase request:", error);
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
            {pr ? (
                <>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        หมายเลขคำขอซื้อ: {pr.pr_id}
                    </Typography>
                    <Chip label={`สถานะ: ${pr.pr_status}`} color="warning" variant="outlined" sx={{ mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                        หมายเหตุ: {pr.pr_note}
                    </Typography>
                    {pr.product && pr.product !== "[]" && (
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
                                        {parseJSON(pr.product).map((item: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.product_name}</TableCell>
                                                <TableCell>
                                                    {item.product_quantity}
                                                </TableCell>
                                                <TableCell>{decimalFix(item.product_price / item.product_quantity)} ฿</TableCell>
                                                <TableCell>{decimalFix(item.product_price)} ฿</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {pr.material && pr.material !== "[]" && (
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
                                        {parseJSON(pr.material).map((item: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.material_name}</TableCell>
                                                <TableCell>
                                                    {item.material_quantity}
                                                </TableCell>
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

export default PurchaseRequestDetailPage;