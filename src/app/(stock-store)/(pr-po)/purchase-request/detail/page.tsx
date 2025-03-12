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
    Chip,
    Breadcrumbs,
    Link,
    Stack,
    Grid
} from "@mui/material";
import { ReceiptLong, EventNote } from "@mui/icons-material";

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
                    <div className="flex justify-between items-center mb-4" >
                        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
                            <Link underline="hover" href="/pr-po-list">
                                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
                                    <ReceiptLong fontSize="small" />
                                    <Typography variant="body1" color="primary">จัดการคำขอซื้อและใบสั่งซื้อ</Typography>
                                </Stack>
                            </Link>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <EventNote fontSize="small" />
                                <Typography variant="body1" color="text.secondary">รายละเอียดคำขอซื้อ</Typography>
                            </Stack>
                        </Breadcrumbs>
                    </div>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        หมายเลขคำขอซื้อ: {pr.pr_id}
                    </Typography>
                    <span
                        className={`inline-block px-3 py-1 mb-2 rounded-2xl text-[17px] font-bold shadow-md
                            ${pr.pr_status === "not-approved" ? "bg-red-500 text-white" :
                                pr.pr_status === "approved" ? "bg-green-500 text-white" :
                                    pr.pr_status === "pending" ? "bg-yellow-500 text-white" : ""}`}
                    >
                        {pr.pr_status === "not-approved" ? "ไม่อนุมัติ" :
                            pr.pr_status === "approved" ? "อนุมัติ" :
                                pr.pr_status === "pending" ? "รอดำเนินการ" : ""}
                    </span>
                    <Typography variant="body1" gutterBottom>
                        หมายเหตุ: {pr.pr_note}
                    </Typography>
                    <Grid container spacing={2}>
                        {pr.product && pr.product !== "[]" && (
                            <Grid item xs={12} md={6}>
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
                                                {parseJSON(pr.product).map((item: any, index: number) => (
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
                            </Grid>
                        )}

                        {pr.material && pr.material !== "[]" && (
                            <Grid item xs={12} md={6}>
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
                                                {parseJSON(pr.material).map((item: any, index: number) => (
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
                            </Grid>
                        )}
                    </Grid>
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