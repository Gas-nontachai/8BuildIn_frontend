"use client";
import React, { useEffect, useState, useRef } from "react";
import Swal from 'sweetalert2';
import { useRouter } from "next/navigation";
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
    Divider
} from "@mui/material";
import { ListAlt, EventNote } from "@mui/icons-material";

import { decimalFix } from "@/utils/number-helper";
import { PurchaseRequest, Unit } from "@/misc/types";
import { usePurchaseRequest } from "@/hooks/hooks";

const PurchaseRequestDetailPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const purchase_request_id = searchParams.get("pr_id");
    const [pr, setPR] = useState<PurchaseRequest | null>(null);
    const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest>({
        pr_id: '',
        pr_status: '',
        pr_note: '',
        product: '',
        material: '',
    });
    const { getPurchaseRequestByID, updatePurchaseRequestBy } = usePurchaseRequest();

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

    const handleNotApprove = async (pr_id: string) => {
        try {
            const { isConfirmed } = await Swal.fire({
                title: 'ไม่อนุมัติ PR นี้?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ใช่',
                cancelButtonText: 'ไม่',
            });
            if (isConfirmed) {
                const updatedData = {
                    ...purchaseRequests,
                    pr_id: pr_id,
                    pr_status: 'not-approve',
                };
                await updatePurchaseRequestBy(updatedData);
            }
        } catch (error) {
            console.log("Error disapprove PR:", error);
        }
    };

    const handleApprove = async (pr_id: string) => {
        try {
            const { isConfirmed } = await Swal.fire({
                title: 'อนุมัติ PR นี้?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ใช่',
                cancelButtonText: 'ไม่',
            });
            if (isConfirmed) {
                Swal.fire({
                    title: 'กำลังดำเนินการ...',
                    text: 'กรุณารอสักครู่',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                const updatedData = {
                    ...purchaseRequests,
                    pr_id: pr_id,
                    pr_status: 'approve',
                };
                await updatePurchaseRequestBy(updatedData);
                Swal.fire({
                    title: 'อนุมัติ PR สำเร็จ',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                }).then(() => {
                    router.push("/pr-po-list");
                });
            }
        } catch (error) {
            console.log("Error approve PR:", error);
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
                                    <ListAlt fontSize="small" />
                                    <Typography variant="body1" color="primary">จัดการคำขอซื้อและใบสั่งซื้อ</Typography>
                                </Stack>
                            </Link>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <EventNote fontSize="small" />
                                <Typography variant="body1" color="text.secondary">รายละเอียดคำขอซื้อ</Typography>
                            </Stack>
                        </Breadcrumbs>
                    </div>
                    <div className="mb-5 -mt-2">
                        <Divider />
                    </div>
                    <Box display="inline-flex" alignItems="center" gap={2}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            หมายเลขคำขอซื้อ: {pr.pr_id}
                        </Typography>
                        <span
                            className={`inline-block px-3 py-1 mb-2 rounded-md text-[17px] font-bold shadow-md
                            ${pr.pr_status === "not-approved" ? "bg-red-500 text-white" :
                                    pr.pr_status === "approved" ? "bg-green-500 text-white" :
                                        pr.pr_status === "pending" ? "bg-yellow-500 text-white" : ""}`}
                        >
                            {pr.pr_status === "not-approved" ? "ไม่อนุมัติ" :
                                pr.pr_status === "approved" ? "อนุมัติ" :
                                    pr.pr_status === "pending" ? "รอดำเนินการ" : ""}
                        </span>
                    </Box>
                    {pr.pr_note && (
                        <Typography variant="body1" gutterBottom>
                            หมายเหตุ: {pr.pr_note}
                        </Typography>
                    )}
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
                        <Grid item xs={12} sx={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 2 }}>
                            <TextField
                                label="หมายเหตุ (ถ้ามี)"
                                multiline
                                value={purchaseRequests.pr_note}
                                onChange={(e) => setPurchaseRequests({ ...purchaseRequests, pr_note: e.target.value })}
                                rows={4}
                                variant="outlined"
                                fullWidth
                            />
                            <div className="flex gap-2">
                                <Tooltip title="อนุมัติคำขอ" arrow>
                                    <Button variant="contained" color="success"
                                        onClick={() => handleApprove(pr.pr_id)}>
                                        อนุมัติ
                                    </Button>
                                </Tooltip>
                                <Tooltip title="ไม่อนุมัติคำขอ" arrow>
                                    <Button variant="contained" color="error"
                                        onClick={() => handleNotApprove(pr.pr_id)}>
                                        ไม่อนุมัติ
                                    </Button>
                                </Tooltip>
                            </div>
                        </Grid>
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