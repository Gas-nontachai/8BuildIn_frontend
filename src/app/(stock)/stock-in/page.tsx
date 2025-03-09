"use client";
import React, { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';
import { API_URL } from '@/utils/config';
import { formatDate } from "@/utils/date-helper"
import { decimalFix, toInt } from "@/utils/number-helper"

import {
    ModeEdit, Delete, Add, Inventory2, Home, MoreVert, Store,
    Search, SwapVert, KeyboardArrowDown, KeyboardArrowUp, Gavel
} from "@mui/icons-material";
import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Menu, TablePagination, InputAdornment, Button,
    Breadcrumbs, MenuItem, IconButton, Typography, Stack, Link, TextField, Collapse, Box, Chip, Avatar, FormControl
} from "@mui/material";

import { usePagination } from "@/context/PaginationContext";

import AddStockin from "@/app/components/StockIn/Add";
import UpdateStockin from "@/app/components/StockIn/Update";
import Loading from "@/app/components/Loading";

import { useSupplier, useStockIn, useUnit } from "@/hooks/hooks";
import { StockIn, Supplier } from '@/misc/types';

const { getStockInBy, deleteStockInBy } = useStockIn();
const { getSupplierBy } = useSupplier();
const { getUnitBy } = useUnit();

const StockInPage = () => {
    const [search, setSearch] = useState("");
    const [sortDate, setSortDate] = useState<"ASC" | "DESC">("DESC");
    const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
    const [loading, setLoading] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [supplier, setSupplier] = useState<Supplier[]>([]);
    const [stockIn, setStockIn] = useState<StockIn[]>([]);
    const stock_in_id = useRef('')
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<StockIn | null>(null);
    const [unit, setUnit] = useState<{ id: string; name: string }[]>([]);

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>, stockin: StockIn) => {
        setAnchorEl(event.currentTarget);
        setSelected(stockin);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelected(null);
    };

    const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});

    const handleRowClick = (stock_in_id: string) => {
        setOpenRows(prevState => ({
            ...prevState,
            [stock_in_id]: !prevState[stock_in_id],
        }));
    };

    useEffect(() => {
        setLoading(true);
        try {
            fetchData();
            fetchUnit()
        } catch (error) {
            console.error("Error fetching StockIn:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchData = async () => {

        try {
            const { docs: res } = await getStockInBy({
                sorter: { key: "adddate", order: sortDate },
                search: {
                    text: search,
                    columns: ["stock_in_id"],
                    condition: "LIKE",
                },
            });

            const supplier_list_arr = res.map(item => item.supplier_id);

            const { docs: supplier_list } = await getSupplierBy({
                supplier_id: { $in: supplier_list_arr },
            });

            setStockIn(res);
            setSupplier(supplier_list);
        } catch (error) {
            console.error("Error fetching StockIn:", error);
        }

    };

    const fetchUnit = async () => {
        try {
            const { docs: res } = await getUnitBy();
            setUnit(res.map(item => ({ id: item.unit_id, name: `${item.unit_name_th}(${item.unit_name_en})` })))
        } catch (error) {
            console.error("Error fetching supplier data:", error);
            Swal.fire("Error", "ไม่สามารถดึงข้อมูลผู้จำหน่ายได้", "error");
        }
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

    const toggleSort = () => {
        setSortDate(prevSort => prevSort === "DESC" ? "ASC" : "DESC");
    };

    useEffect(() => {
        fetchData();
    }, [sortDate]);

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
                <div>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="ค้นหาชื่อพนักงาน..."
                        className="w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                fetchData();
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={toggleSort}
                        startIcon={<SwapVert />}
                    >
                        {sortDate === "ASC" ? "เก่า → ใหม่" : "ใหม่ → เก่า"}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsAddDialogOpen(true)}
                        startIcon={<Add />}
                    >
                        เพิ่มสต็อกเข้า
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        href="/unit"
                    >
                        จัดการหน่วยสินค้า
                    </Button>
                </div>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <TableContainer style={{ minHeight: "24rem" }}>
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-200">
                                    <TableCell># </TableCell>
                                    <TableCell>รหัสสต็อก </TableCell>
                                    <TableCell align="center">ดูรายละเอียดสต็อกเข้า</TableCell>
                                    <TableCell>ผู้จัดจำหน่าย</TableCell>
                                    <TableCell>วันที่ถูกเพิ่ม</TableCell>
                                    <TableCell> จัดการ </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stockIn.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((stock, index) => (
                                    <React.Fragment key={stock.stock_in_id}>
                                        <TableRow key={stock.stock_in_id} hover >
                                            <TableCell>{page * rowsPerPage + index + 1} </TableCell>
                                            <TableCell>{stock.stock_in_id} </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => handleRowClick(stock.stock_in_id)}
                                                >
                                                    {openRows[stock.stock_in_id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <img className="w-10 h-10 rounded-3xl border-2" src={`${API_URL}${supplier.find((s) => s.supplier_id === stock.supplier_id)?.supplier_img}` || "/default-emp"} />
                                                    <span className="text-[15px] font-[400]">{supplier.find((s) => s.supplier_id === stock.supplier_id)?.supplier_name || "Unknown"}</span>
                                                </div>
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
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                                                <Collapse in={openRows[stock.stock_in_id]} timeout="auto" unmountOnExit>
                                                    <Box sx={{ marginTop: 3, marginBottom: 3 }}>
                                                        <div className="mb-2">
                                                            <h2 className="text-lg font-semibold">รายละเอียดสินค้าและวัสดุ</h2>
                                                        </div>
                                                        {JSON.parse(stock.product).length > 0 && (
                                                            <Box>
                                                                <div className="my-2">
                                                                    <Chip
                                                                        sx={{ fontSize: 14, fontWeight: 600 }}
                                                                        avatar={<Avatar><Store /></Avatar>}
                                                                        label={`สินค้า ${JSON.parse(stock.product).length} ชิ้น`}
                                                                        color="primary"
                                                                    />
                                                                </div>
                                                                <Table size="small" aria-label="products">
                                                                    <TableHead className="bg-gray-200">
                                                                        <TableRow>
                                                                            <TableCell sx={{ width: '33%' }}>ชื่อสินค้า</TableCell>
                                                                            <TableCell sx={{ width: '33%' }}>จำนวน </TableCell>
                                                                            <TableCell sx={{ width: '33%' }}>ราคารวม (บาท)</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {JSON.parse(stock.product).map((product: { product_name: string; product_quantity: string; unit_id: string, product_price: string }) => (
                                                                            <TableRow key={product.product_name}>
                                                                                <TableCell>{product.product_name}</TableCell>
                                                                                <TableCell>{decimalFix(product.product_quantity, 0)} {unit.find((s) => s.id === product.unit_id)?.name || "ชิ้น(items)"}</TableCell>
                                                                                <TableCell>{decimalFix(product.product_price)} ฿</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </Box>
                                                        )}
                                                        {JSON.parse(stock.material).length > 0 && (
                                                            <Box>
                                                                <div className="my-2">
                                                                    <Chip
                                                                        sx={{ fontSize: 14, fontWeight: 600 }}
                                                                        avatar={<Avatar><Gavel /></Avatar>}
                                                                        label={`วัสดุ ${JSON.parse(stock.material).length} ชิ้น`}
                                                                        color="primary"
                                                                    />
                                                                </div>
                                                                <Table size="small" aria-label="materials">
                                                                    <TableHead className="bg-gray-200">
                                                                        <TableRow>
                                                                            <TableCell sx={{ width: '33%' }}>ชื่อวัสดุ</TableCell>
                                                                            <TableCell sx={{ width: '33%' }}>จำนวน</TableCell>
                                                                            <TableCell sx={{ width: '33%' }}>ราคารวม (บาท)</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {JSON.parse(stock.material).map((material: { material_name: string; material_quantity: string; unit_id: string, material_price: string }) => (
                                                                            <TableRow key={material.material_name}>
                                                                                <TableCell>{material.material_name}</TableCell>
                                                                                <TableCell>{decimalFix(material.material_quantity, 0)} {unit.find((s) => s.id === material.unit_id)?.name || "ชิ้น(items)"}</TableCell>
                                                                                <TableCell>{decimalFix(material.material_price)} ฿</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </Box>
                                                        )}
                                                        {stock.stock_in_note && (
                                                            <div className="my-2">
                                                                <p className="text-[20px] font-[300]"> หมายเหตุ <span className="text-red-500">*</span></p>
                                                                <textarea
                                                                    value={stock.stock_in_note}
                                                                    disabled
                                                                    rows={3}
                                                                    className="w-full p-2 mt-2 border border-gray-400 text-[16px] font-[300] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                        )}
                                                    </Box>

                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
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
