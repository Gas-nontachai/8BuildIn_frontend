"use client";
import { useEffect, useRef, useState } from "react";
import { ModeEdit, Delete, Add, ReceiptLongRounded } from "@mui/icons-material";
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, CircularProgress } from "@mui/material";
import { usePagination } from "@/context/PaginationContext";

import AddStockin from "@/app/components/StockIn/Add";
import UpdateStockin from "@/app/components/StockIn/Update";

import useStockIn from "@/hooks/useStockIn";
import useSupplier from "@/hooks/useSupplier";
import { StockIn, Supplier } from '@/misc/types';

const { getStockInBy, deleteStockInBy } = useStockIn();
const { getSupplierBy } = useSupplier();

const StockInPage = () => {
    const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
    const [loading, setLoading] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [supplier, setSupplier] = useState<Supplier[]>([]);
    const [stockIn, setStockIn] = useState<StockIn[]>([]);
    const stock_in_id = useRef('')

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { docs: res } = await getStockInBy();
            const supplier_llist_arr = res.map(item => item.supplier_id)
            const { docs: supplier_llist } = await getSupplierBy({
                supplier_id: { $in: supplier_llist_arr }
            });
            setStockIn(res);
            setSupplier(supplier_llist);
        } catch (error) {
            console.error("Error fetching StockIn:", error);
        }
        setLoading(false);
    };

    const onDelete = async (stock_in_id: string) => {
        const result = await Swal.fire({
            title: "คุณแน่ใจหรือไม่?",
            text: "คุณจะไม่สามารถย้อนกลับการกระทำนี้ได้!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ลบ",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                await deleteStockInBy({ stock_in_id: stock_in_id })
                Swal.fire("ลบแล้ว!", "ข้อมูลผู้จัดจำหน่ายถูกลบเรียบร้อยแล้ว", "success");
                await fetchData();
            } catch (error) {
                console.error("Error deleting supplier:", error);
            }
        }
    };

    return (
        <>
            <div className="flex justify-between mb-4" >
                <span className="text-xl font-[400]" >ข้อมูลสต็อกเข้า</span>
                <Button variant="contained" color="primary" onClick={() => setIsAddDialogOpen(true)} startIcon={<Add />}>
                    เพิ่มสต็อกเข้า
                </Button>
            </div>

            {
                loading ? (
                    <div className="flex justify-center flex-col items-center py-4 text-[15px]" >
                        <CircularProgress />
                        < span className="mt-3" > กำลังโหลดข้อมูล...</span>
                    </div>
                ) : (
                    <Paper className="shadow-md" >
                        <TableContainer style={{ minHeight: "24rem" }}>
                            <Table>
                                <TableHead>
                                    <TableRow className="bg-gray-200" >
                                        <TableCell># </TableCell>
                                        < TableCell > ชื่อสต็อกเข้า </TableCell>
                                        < TableCell > ผู้จัดจำหน่าย </TableCell>
                                        < TableCell align="center" > จัดการ </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stockIn.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((stock, index) => (
                                        <TableRow key={stock.stock_in_id} hover >
                                            <TableCell>{index + 1} </TableCell>
                                            <TableCell>
                                                <span><strong>สินค้า</strong></span>
                                                {JSON.parse(stock.product).map((product: { product_name: string; product_quantity: string, product_price: string }) => (
                                                    <div key={product.product_name}>• {product.product_name} : {product.product_quantity} ชิ้น : {product.product_price} บาท</div>
                                                ))}
                                                <span> <strong>วัสดุ</strong></span>
                                                {JSON.parse(stock.material).map((material: { material_name: string; material_quantity: string, material_price: string }) => (
                                                    <div key={material.material_name}>• {material.material_name} : {material.material_quantity}ชิ้น : {material.material_price} บาท</div>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                {supplier.find((s) => s.supplier_id === stock.supplier_id)?.supplier_name || "Unknown"}
                                            </TableCell>
                                            < TableCell >
                                                <div className="flex justify-center gap-2" >
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        startIcon={< ModeEdit />}
                                                        onClick={() => {
                                                            setIsUpdateDialogOpen(true);
                                                            stock_in_id.current = stock.stock_in_id;
                                                        }
                                                        }
                                                    >
                                                        แก้ไข
                                                    </Button>
                                                    < Button variant="outlined" color="error" startIcon={< Delete />} onClick={() => onDelete(stock.stock_in_id)}>
                                                        ลบ
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        < TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={stockIn.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={onChangePage}
                            onRowsPerPageChange={onChangeRowsPerPage}
                        />
                    </Paper>
                )}

            <AddStockin open={isAddDialogOpen} onRefresh={() => fetchData()} onClose={() => setIsAddDialogOpen(false)} />
            <UpdateStockin open={isUpdateDialogOpen} stock_in_id={stock_in_id.current} onRefresh={() => fetchData()} onClose={() => setIsUpdateDialogOpen(false)} />

        </>
    );
};

export default StockInPage;
