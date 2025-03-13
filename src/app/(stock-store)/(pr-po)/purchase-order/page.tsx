"use client";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "@/utils/date-helper"
import { pdf } from '@react-pdf/renderer';

import { Home, Description, ReceiptLong } from "@mui/icons-material";
import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Box, TablePagination, Button, Breadcrumbs, Typography, Stack, Link, TextField
} from "@mui/material";
import { usePagination } from "@/context/PaginationContext";
import { useRouter } from 'next/navigation';
import Loading from "@/app/components/Loading";
import PurchaseOrderAdd from "@/app/components/StockStore/(PR-PO)/PR/Add";

import { PurchaseOrder, Employee } from '@/misc/types';
import { usePurchaseOrder, useEmployee } from "@/hooks/hooks";
import PO from "@/app/components/StockStore/(PDF)/PO";

const { getPurchaseOrderBy } = usePurchaseOrder();
const { getEmployeeBy } = useEmployee();

const PurchaseOrderPage = () => {
    const router = useRouter();

    const { page, setPage, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [employee, setEmployee] = useState<Employee[]>([]);

    const [isDialogAdd, setIsDialogAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true);
            const { docs: res } = await getPurchaseOrderBy();
            const { docs: res_emp } = await getEmployeeBy({
                match: {
                    $in: res.map((item) => item.addby)
                }
            });
            setEmployee(res_emp);
            setPurchaseOrders(res);
            console.log("res", res);
        } catch (error) {
            console.log("Error fetching Purchase Order:", error);
        } finally {
            setLoading(false);
        }
    };

    const openPDF = async (purchaseOrder: PurchaseOrder) => {
        try {
            const blob = await pdf(<PO purchaseOrder={purchaseOrder} />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-3">
                <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
                    <Link underline="hover" href="/">
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
                            <Home fontSize="small" />
                            <Typography variant="body1" color="primary">หน้าหลัก</Typography>
                        </Stack>
                    </Link>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <ReceiptLong fontSize="small" />
                        <Typography variant="body1" color="text.secondary">ใบสั่งซื้อ</Typography>
                    </Stack>
                </Breadcrumbs>
            </div>
            <div className="flex justify-between mb-3">
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="ค้นหารหัสใบสั่งซื้อ..."
                    className="w-64"
                />
            </div>
            {loading ? (
                <Loading />
            ) : (
                <TableContainer style={{ minHeight: "24rem" }}>
                    <Table>
                        <TableHead>
                            <TableRow className="bg-gray-200">
                                <TableCell>#</TableCell>
                                <TableCell align="center">รหัสใบสั่งซื้อ</TableCell>
                                <TableCell align="center">สถานะใบสั่งซื้อ</TableCell>
                                <TableCell align="center">หมายเหตุ</TableCell>
                                <TableCell align="center">เพิ่มโดย</TableCell>
                                <TableCell align="center">วันเวลาเพิ่ม</TableCell>
                                <TableCell align="center">อัพเดทล่าสุด</TableCell>
                                <TableCell align="center">ออกบิล</TableCell>
                            </TableRow >
                        </TableHead >
                        <TableBody>
                            {purchaseOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                <TableRow key={item.po_id} hover>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell align="center">{item.po_id}</TableCell>
                                    <TableCell align="center">
                                        {item.po_status === 'pending' ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-white bg-yellow-500">
                                                รอดำเนินการ
                                            </span>
                                        ) : item.po_status === 'buying' ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-white bg-orange-500">
                                                กำลังสั่งซื้อ
                                            </span>
                                        ) : item.po_status === 'success' ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-white bg-green-600">
                                                นำเข้าสินค้าสำเร็จแล้ว
                                            </span>
                                        ) : item.po_status === 'not-approved' ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-white bg-red-500">
                                                ไม่อนุมัติ
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-black bg-gray-300">
                                                {item.po_status}
                                            </span>
                                        )}

                                    </TableCell>
                                    <TableCell align="center">{item.po_note}</TableCell>
                                    <TableCell align="center">
                                        <Button onClick={() => router.push(`/profile/detail?id=${item.addby}`)}>
                                            {(() => {
                                                const emp = employee.find((e) => e.employee_id === item.addby);
                                                return emp ? `${emp.employee_firstname} ${emp.employee_lastname}` : "";
                                            })()}
                                        </Button >
                                    </TableCell>
                                    <TableCell align="center">{formatDate(item.adddate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                                    <TableCell align="center">{formatDate(item.lastupdate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                                    <TableCell align="center">
                                        <Box display="flex" justifyContent="center" alignItems="center">
                                            <Button
                                                size="small"
                                                onClick={() => openPDF(item)}
                                                color="info"
                                                variant="contained"
                                                startIcon={<Description />}
                                                sx={{
                                                    backgroundColor: "#ef4036",
                                                    color: "#fff",
                                                    textTransform: "none",
                                                    borderRadius: "12px",
                                                    padding: "3px 4px",
                                                    transition: "0.3s",
                                                    "&:hover": {
                                                        boxShadow: 6,
                                                        backgroundColor: "#ff2116",
                                                    }
                                                }}
                                            >
                                                PDF
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table >
                </TableContainer>
            )}
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={purchaseOrders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
            />

            <PurchaseOrderAdd open={isDialogAdd} onClose={() => setIsDialogAdd(false)} onRefresh={async () => { await fetchData() }} />
        </>
    )
}

export default PurchaseOrderPage