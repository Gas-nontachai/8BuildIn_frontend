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
import { FirstPage, EventNote } from "@mui/icons-material";

import { PurchaseRequest } from "@/misc/types";
import { usePurchaseRequest } from "@/hooks/hooks";

const { getPurchaseRequestByID, updatePurchaseRequestBy } = usePurchaseRequest();

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


    useEffect(() => {
        if (purchase_request_id) {
            fetchData();
        }
    }, [purchase_request_id]);

    const fetchData = async () => {
        try {
            const res = await getPurchaseRequestByID({ pr_id: purchase_request_id || "" });
            setPR(res);
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
        <>
            {pr ? (
                <>
                    <div className="flex justify-between items-center mb-4" >
                        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
                            <Link underline="hover" onClick={() => router.back()}>
                                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main', cursor: 'pointer' }}>
                                    <FirstPage fontSize="small" />
                                    <Typography variant="body1" color="primary">ย้อนกลับ</Typography>
                                </Stack>
                            </Link>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <EventNote fontSize="small" />
                                <Typography variant="body1" color="text.secondary">รายละเอียดใบขอซื้อ</Typography>
                            </Stack>
                        </Breadcrumbs>
                    </div>
                    <div className="flex justify-between">
                        <div className="font-bold text-xl mb-2 text-gray-700">
                            หมายเลขใบขอซื้อ : {pr.pr_id}
                        </div>
                        <span
                            className={`inline-block px-2 py-1 mb-2 rounded-md text-[14px] font-[600] shadow-md
                            ${pr.pr_status === "not-approved" ? "bg-red-500 text-white" :
                                    pr.pr_status === "approved" ? "bg-green-600 text-white" :
                                        pr.pr_status === "success" ? "bg-blue-500 text-white" :
                                            pr.pr_status === "pending" ? "bg-yellow-500 text-white" : ""}`}
                        >
                            {pr.pr_status === "not-approved" ? "ไม่อนุมัติ" :
                                pr.pr_status === "approved" ? "อนุมัติแล้ว" :
                                    pr.pr_status === "success" ? "สั่งซื้อสำเร็จ" :
                                        pr.pr_status === "pending" ? "รอดำเนินการ" : ""}
                        </span>
                    </div>
                    {pr.pr_note && (
                        <h6 className="text-[15px] font-[400] text-gray-700 mb-1">
                            หมายเหตุ : <span className="text-[14px] font-[300]">{pr.pr_note}</span>
                        </h6>
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div className="mt-3 -mb-5">
                                <Divider />
                            </div>
                        </Grid>
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
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {parseJSON(pr.product).map((item: any, index: number) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.product_name}</TableCell>
                                                        <TableCell>{item.product_quantity}</TableCell>
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
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {parseJSON(pr.material).map((item: any, index: number) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.material_name}</TableCell>
                                                        <TableCell>{item.material_quantity}</TableCell>
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
                                <Tooltip title="อนุมัติใบขอ" arrow>
                                    <Button variant="contained" color="success"
                                        onClick={() => handleApprove(pr.pr_id)}>
                                        อนุมัติ
                                    </Button>
                                </Tooltip>
                                <Tooltip title="ไม่อนุมัติใบขอ" arrow>
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
        </>
    );
};

export default PurchaseRequestDetailPage;