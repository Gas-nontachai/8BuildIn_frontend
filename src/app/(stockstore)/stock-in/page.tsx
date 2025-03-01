"use client";
import { useEffect, useRef, useState } from "react";
import { ModeEdit, Delete } from "@mui/icons-material";
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, CircularProgress } from "@mui/material";
import { usePagination } from "@/context/PaginationContext";

import AddStockin from "@/app/components/StockIn/Add";
import UpdateStockin from "@/app/components/StockIn/Update";

import useStockIn from "@/hooks/useStockIn";
import { StockIn } from '@/misc/types';

const { getStockInBy, deleteStockInBy } = useStockIn();

const StockInPage = () => {
    const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
    const [loading, setLoading] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [stockIn, setStockIn] = useState<StockIn[]>([]);
    const stock_in_id = useRef('')

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { docs: res } = await getStockInBy();
            setStockIn(res);
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
            <div className="flex justify-between" >
                <span className="text-xl font-[400] mb-4" > จัดการข้อมูลสต็อกเข้า </span>
                < div className="flex gap-2" >
                    <button
                        className="mb-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded"
                        onClick={() => setIsAddDialogOpen(true)}
                    >
                        เพิ่มสต็อกเข้า
                    </button>
                </div>
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
                                        < TableCell > ประเภท </TableCell>
                                        < TableCell align="center" > จัดการ </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        stockIn.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((stock, index) => (
                                            <TableRow key={stock.stock_in_id} hover >
                                                <TableCell>{index + 1} </TableCell>
                                                < TableCell >
                                                    {JSON.parse(stock.product).map((product: { product_name: string; product_quantity: string, product_price: string }) => (
                                                        <div key={product.product_name}>• {product.product_name} : {product.product_quantity} ชิ้น : {product.product_price} บาท</div>
                                                    ))}
                                                </TableCell>
                                                < TableCell >
                                                    {JSON.parse(stock.material).map((material: { material_name: string; material_quantity: string, material_price: string }) => (
                                                        <div key={material.material_name}>• {material.material_name} : {material.material_quantity}ชิ้น : {material.material_price} บาท</div>
                                                    ))}
                                                </TableCell>
                                                < TableCell >
                                                    <div className="flex justify-center gap-2" >
                                                        <Button
                                                            variant="contained"
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
                                                        < Button variant="contained" color="error" startIcon={< Delete />} onClick={() => onDelete(stock.stock_in_id)}>
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

            <AddStockin open={isAddDialogOpen} onClose={async () => { setIsAddDialogOpen(false); await fetchData(); }} />
            <UpdateStockin open={isUpdateDialogOpen} stock_in_id={stock_in_id.current} onClose={async () => { setIsUpdateDialogOpen(false); await fetchData(); }} />

        </>
    );
};

export default StockInPage;
