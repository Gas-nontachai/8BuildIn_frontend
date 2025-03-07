"use client";
import { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';
import { formatDate } from "@/utils/date-helper"
import { ModeEdit, Delete, Add, Inventory2, Home, MoreVert } from "@mui/icons-material";
import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Menu, TablePagination, Button, Breadcrumbs, MenuItem, IconButton, Typography, Stack, Link, TextField
} from "@mui/material";
import { usePagination } from "@/context/PaginationContext";

import AddStockin from "@/app/components/StockIn/Add";
import UpdateStockin from "@/app/components/StockIn/Update";
import Loading from "@/app/components/Loading";

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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<StockIn | null>(null);

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>, stockin: StockIn) => {
        setAnchorEl(event.currentTarget);
        setSelected(stockin);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelected(null);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { docs: res } = await getStockInBy();
            const supplier_list_arr = res.map(item => item.supplier_id)
            const { docs: supplier_llist } = await getSupplierBy({
                supplier_id: { $in: supplier_list_arr }
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
            <div className="flex justify-start items-center mb-4" >
                <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
                    <Link underline="hover" href="/">
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
                            <Home fontSize="small" />
                            <Typography variant="body1" color="primary">หน้าหลัก</Typography>
                        </Stack>
                    </Link>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Inventory2 fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body1" color="text.secondary">ข้อมูลสต็อกเข้า</Typography>
                    </Stack>
                </Breadcrumbs>
            </div>
            <div className="flex justify-between items-center mb-4">
                <div className=" ">
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="ค้นหารหัสสต็อก..."
                        className="w-64"
                    />
                </div>
                <Button variant="contained" color="primary" onClick={() => setIsAddDialogOpen(true)} startIcon={<Add />}>
                    เพิ่มสต็อกเข้า
                </Button>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <TableContainer style={{ minHeight: "24rem" }}>
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-200" >
                                    <TableCell># </TableCell>
                                    <TableCell>รหัสสต็อก </TableCell>
                                    < TableCell >ชื่อสต็อกเข้า</TableCell>
                                    < TableCell >ผู้จัดจำหน่าย</TableCell>
                                    < TableCell >วันที่ถูกเพิ่ม</TableCell>
                                    < TableCell > จัดการ </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stockIn.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((stock, index) => (
                                    <TableRow key={stock.stock_in_id} hover >
                                        <TableCell>{page * rowsPerPage + index + 1} </TableCell>
                                        <TableCell>{stock.stock_in_id} </TableCell>
                                        <TableCell>
                                            {
                                                JSON.parse(stock.product).length > 0 && (
                                                    <span><strong>สินค้า {JSON.parse(stock.product).length} ชิ้น</strong></span>
                                                )
                                            }
                                            {JSON.parse(stock.product).map((product: { product_name: string; product_quantity: string, product_price: string }) => (
                                                <div key={product.product_name}>• {product.product_name} : {product.product_quantity} ชิ้น : {product.product_price} บาท</div>
                                            ))}
                                            {
                                                JSON.parse(stock.material).length > 0 && (
                                                    <span><strong>วัสดุ {JSON.parse(stock.material).length} ชิ้น</strong></span>
                                                )
                                            }
                                            {JSON.parse(stock.material).map((material: { material_name: string; material_quantity: string, material_price: string }) => (
                                                <div key={material.material_name}>• {material.material_name} : {material.material_quantity}ชิ้น : {material.material_price} บาท</div>
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            {supplier.find((s) => s.supplier_id === stock.supplier_id)?.supplier_name || "Unknown"}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(stock.adddate)}
                                        </TableCell>
                                        < TableCell >
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleClickMenu(e, stock)}
                                            >
                                                <MoreVert />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleCloseMenu}
                                            >
                                                <MenuItem onClick={() => {
                                                    setIsUpdateDialogOpen(true);
                                                    stock_in_id.current = selected?.stock_in_id!;
                                                    handleCloseMenu();
                                                }}>
                                                    <ModeEdit className="mr-2" /> แก้ไข
                                                </MenuItem>
                                                <MenuItem onClick={() => {
                                                    onDelete(selected?.stock_in_id!);
                                                    handleCloseMenu();
                                                }}>
                                                    <Delete className="mr-2" /> ลบ
                                                </MenuItem>
                                            </Menu>
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
                </>
            )}

            <AddStockin open={isAddDialogOpen} onRefresh={() => fetchData()} onClose={() => setIsAddDialogOpen(false)} />
            <UpdateStockin open={isUpdateDialogOpen} stock_in_id={stock_in_id.current} onRefresh={() => fetchData()} onClose={() => setIsUpdateDialogOpen(false)} />

        </>
    );
};

export default StockInPage;
