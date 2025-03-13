"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/date-helper"

import { Description, Visibility } from "@mui/icons-material";
import {
    Box, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TablePagination, TableRow, TextField
} from "@mui/material";
import { pdf } from '@react-pdf/renderer';
import PO from "@/app/components/StockStore/(PDF)/PO";
import Loading from "@/app/components/Loading";
import { usePagination } from "@/context/PaginationContext";

import { PurchaseOrder } from '@/misc/types';
import { usePurchaseOrder } from "@/hooks/hooks";

const { getPurchaseOrderBy, updatePurchaseOrderBy } = usePurchaseOrder();

const TableListPO = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { docs: res } = await getPurchaseOrderBy();
            setPurchaseOrders(res);
        }
        catch (error) {
            console.log("Error fetching Purchase Request:", error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleDetail = (po_id: string) => {
        router.push('/purchase-order/detail/?po_id=' + po_id);
    }

    const openPDF = async (purchaseOrder: PurchaseOrder) => {
        try {
            const blob = await pdf(<PO purchaseOrder={purchaseOrder} />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    }

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="flex justify-between mb-3">
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="ค้นหารหัสใบสั่งซื้อ..."
                            className="w-64"
                        />
                    </div>
                    <TableContainer style={{ minHeight: "24rem" }}>
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-200">
                                    <TableCell>#</TableCell>
                                    <TableCell align="center">รหัสขอคำซื้อ</TableCell>
                                    <TableCell align="center">รหัสใบสั่งซื้อ</TableCell>
                                    <TableCell align="center">สถานะใบสั่งซื้อ</TableCell>
                                    <TableCell align="center">หมายเหตุ</TableCell>
                                    <TableCell align="center">วันที่เพิ่ม</TableCell>
                                    <TableCell align="center">ดูบิล</TableCell>
                                    <TableCell align="center">จัดการใบสั่งซื้อ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {purchaseOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                    <TableRow key={item.po_id} hover>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell align="center">{item.po_id}</TableCell>
                                        <TableCell align="center">{item.pr_id}</TableCell>
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
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-white bg-blue-500">
                                                    สั่งซื้อสำเร็จ
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
                                        <TableCell align="center">{formatDate(item.adddate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
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
                                                            boxShadow: 6
                                                        }
                                                    }}
                                                >
                                                    PDF
                                                </Button>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                onClick={() => handleDetail(item.po_id)}
                                                color="info"
                                                variant="contained"
                                                size="small"
                                                startIcon={<Visibility />}
                                                sx={{
                                                    borderRadius: "12px",
                                                    textTransform: "none",
                                                    fontWeight: "600",
                                                    padding: "3px 10px",
                                                    boxShadow: 3,
                                                    transition: "all 0.3s ease",
                                                    "&:hover": {
                                                        boxShadow: 6
                                                    }
                                                }}
                                            >
                                                จัดการใบสั่งซื้อ
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table >
                    </TableContainer >
                </>
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
        </>
    )
}
export default TableListPO