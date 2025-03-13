"use client";
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { API_URL } from '@/utils/config';
import { formatDate } from "@/utils/date-helper"
import { decimalFix } from "@/utils/number-helper"

import {
    Add, Inventory2, Home, Store,
    Search, SwapVert, KeyboardArrowDown, KeyboardArrowUp, Gavel
} from "@mui/icons-material";

import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TablePagination, InputAdornment, Button,
    Breadcrumbs, IconButton, Typography, Stack, Link, TextField, Collapse, Divider, Chip, Avatar, Card, CardContent
} from "@mui/material";
import { useRouter } from 'next/navigation';
import { usePagination } from "@/context/PaginationContext";

import AddStockIn from "@/app/components/StockStore/StockIn/Add";
import Loading from "@/app/components/Loading";

import { useSupplier, useStockIn, useUnit, useEmployee } from "@/hooks/hooks";
import { StockIn, Supplier, Employee } from '@/misc/types';

const { getStockInBy } = useStockIn();
const { getSupplierBy } = useSupplier();
const { getUnitBy } = useUnit();
const { getEmployeeBy } = useEmployee();

const StockInPage = () => {
    const router = useRouter();
    const { page, setPage, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
    const [search, setSearch] = useState("");
    const [sortDate, setSortDate] = useState<"ASC" | "DESC">("DESC");
    const [loading, setLoading] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [supplier, setSupplier] = useState<Supplier[]>([]);
    const [employee, setEmployee] = useState<Employee[]>([]);
    const [stockIn, setStockIn] = useState<StockIn[]>([]);
    const [unit, setUnit] = useState<{ id: string; name: string }[]>([]);

    const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});

    const handleRowClick = (stock_in_id: string) => {
        setOpenRows(prevState => ({
            ...prevState,
            [stock_in_id]: !prevState[stock_in_id],
        }));
    };

    useEffect(() => {
        fetchData();
        fetchUnit()
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { docs: res } = await getStockInBy({
                sorter: { key: "adddate", order: sortDate },
                search: {
                    text: search,
                    columns: ["stock_in_id"],
                    condition: "LIKE",
                },
            });
            const supplier_list_arr = res.map(item => item.supplier_id);
            const employee_id = res.map(item => item.addby);

            const { docs: supplier_list } = await getSupplierBy({
                match: {
                    supplier_id: { $in: supplier_list_arr },
                }
            });

            const { docs: employee_list } = await getEmployeeBy({
                match: {
                    employee_id: { $in: employee_id },
                }
            });
            setPage(0)
            setStockIn(res);
            setSupplier(supplier_list);
            setEmployee(employee_list);
        } catch (error) {
            console.error("Error fetching StockIn:", error);
        } finally {
            setLoading(false);
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
                        placeholder="ค้นหาชื่อชื่อสต็อก..."
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
                        color="success"
                        onClick={() => setIsAddDialogOpen(true)}
                        startIcon={<Add />}
                    >
                        เพิ่มสต็อกเข้า
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
                                    <TableCell align="center"># </TableCell>
                                    <TableCell align="center">รหัสสต็อก </TableCell>
                                    <TableCell align="center">ดูรายละเอียดสต็อกเข้า</TableCell>
                                    <TableCell>ผู้จัดจำหน่าย</TableCell>
                                    <TableCell align="center">วันที่ถูกเพิ่ม</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stockIn.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((stock, index) => (
                                    <React.Fragment key={stock.stock_in_id}>
                                        <TableRow key={stock.stock_in_id} hover >
                                            <TableCell align="center">{page * rowsPerPage + index + 1} </TableCell>
                                            <TableCell align="center">{stock.stock_in_id} </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => handleRowClick(stock.stock_in_id)}
                                                >
                                                    {openRows[stock.stock_in_id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="center">
                                                <div className="flex justify-start  items-center space-x-2">
                                                    <img className="w-10 h-10 rounded-3xl border-2" src={`${API_URL}${supplier.find((s) => s.supplier_id === stock.supplier_id)?.supplier_img}` || "/default-emp"} />
                                                    <span className="text-[15px] font-[400]">{supplier.find((s) => s.supplier_id === stock.supplier_id)?.supplier_name || "Unknown"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">
                                                {formatDate(stock.adddate, "dd/MM/yyyy HH:mm:ss")}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                                                <Collapse in={openRows[stock.stock_in_id]} timeout="auto" unmountOnExit>
                                                    <Card sx={{ marginTop: 3, marginBottom: 3 }}>
                                                        <CardContent>
                                                            <h2 className="text-xl font-bold mb-4 text-gray-800">รายละเอียดสินค้าและวัสดุ</h2>
                                                            <div className="text-sm font-medium text-gray-600 mb-2">
                                                                รหัสใบสั่งซื้อ :
                                                                <Button onClick={() => router.push(`/purchase-order/detail?po_id=${stock.po_id}`)}>
                                                                    {stock.po_id || 'ไม่ทราบรหัสใบสั่งซื้อ'}
                                                                </Button >
                                                            </div>
                                                            <div className="text-sm font-medium text-gray-600 mb-2">
                                                                เพิ่มสต็อกเข้าโดย :
                                                                <Button onClick={() => router.push(`/profile/detail?id=${stock.addby}`)}>
                                                                    {(() => {
                                                                        const emp = employee.find((e) => e.employee_id === stock.addby);
                                                                        return emp ? `${emp.employee_firstname} ${emp.employee_lastname}` : "";
                                                                    })()}
                                                                </Button >
                                                            </div>
                                                            <div className="text-sm font-medium text-gray-600 mb-4">
                                                                วันที่เพิ่ม : {formatDate(stock.adddate, "dd/MM/yyyy HH:mm:ss")}
                                                            </div>
                                                            {stock.stock_in_note && (
                                                                <>
                                                                    <p className="text-[16px] font-medium text-gray-800 mb-1">หมายเหตุ <span className="text-red-500">*</span></p>

                                                                    <div className="w-full p-3 mt-2 border border-gray-300 text-[14px] bg-[#eee] rounded-md">
                                                                        {stock.stock_in_note}
                                                                    </div>
                                                                </>
                                                            )}
                                                            <Divider></Divider>
                                                        </CardContent>
                                                        {JSON.parse(stock.product).length > 0 && (
                                                            <CardContent sx={{ mb: -2 }}>
                                                                <div className="mb-2">
                                                                    <Chip
                                                                        avatar={<Avatar><Store /></Avatar>}
                                                                        label={`สินค้า ${JSON.parse(stock.product).length} ชิ้น`}
                                                                        color="primary"
                                                                        sx={{
                                                                            '& .MuiChip-label': {
                                                                                fontWeight: '500',
                                                                            },
                                                                        }}
                                                                    />
                                                                </div>
                                                                <Table size="small" aria-label="products">
                                                                    <TableHead className="bg-gray-200">
                                                                        <TableRow>
                                                                            <TableCell sx={{ width: '22%' }}>ชื่อสินค้า</TableCell>
                                                                            <TableCell sx={{ width: '22%' }}>จำนวน</TableCell>
                                                                            <TableCell sx={{ width: '22%' }}>ราคาต่อชิ้น (บาท)</TableCell>
                                                                            <TableCell sx={{ width: '22%' }}>ราคารวม (บาท)</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {JSON.parse(stock.product).map((product: { product_name: string; product_quantity: string; unit_id: string, product_price: string }) => (
                                                                            <TableRow key={product.product_name}>
                                                                                <TableCell>{product.product_name}</TableCell>
                                                                                <TableCell>{decimalFix(product.product_quantity, 0)} {unit.find((s) => s.id === product.unit_id)?.name || "ชิ้น(items)"}</TableCell>
                                                                                <TableCell>{decimalFix(Number(product.product_price) / Number(product.product_quantity))} ฿</TableCell>
                                                                                <TableCell>{decimalFix(product.product_price)} ฿</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </CardContent>
                                                        )}

                                                        {JSON.parse(stock.material).length > 0 && (
                                                            <CardContent>
                                                                <div className="mb-2">
                                                                    <Chip
                                                                        avatar={<Avatar><Gavel /></Avatar>}
                                                                        label={`วัสดุ ${JSON.parse(stock.material).length} ชิ้น`}
                                                                        color="error"
                                                                        sx={{
                                                                            '& .MuiChip-label': {
                                                                                fontWeight: '500',
                                                                            },
                                                                        }}
                                                                    />
                                                                </div>
                                                                <Table size="small" aria-label="materials">
                                                                    <TableHead className="bg-gray-200">
                                                                        <TableRow>
                                                                            <TableCell sx={{ width: '22%' }}>ชื่อวัสดุ</TableCell>
                                                                            <TableCell sx={{ width: '22%' }}>จำนวน</TableCell>
                                                                            <TableCell sx={{ width: '22%' }}>ราคาต่อชิ้น (บาท)</TableCell>
                                                                            <TableCell sx={{ width: '22%' }}>ราคารวม (บาท)</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {JSON.parse(stock.material).map((material: { material_name: string; material_quantity: string; unit_id: string, material_price: string }) => (
                                                                            <TableRow key={material.material_name}>
                                                                                <TableCell>{material.material_name}</TableCell>
                                                                                <TableCell>{decimalFix(material.material_quantity, 0)} {unit.find((s) => s.id === material.unit_id)?.name || "ชิ้น(items)"}</TableCell>
                                                                                <TableCell>{decimalFix(Number(material.material_price) / Number(material.material_quantity))} ฿</TableCell>
                                                                                <TableCell>{decimalFix(material.material_price)} ฿</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </CardContent>
                                                        )}
                                                    </Card>
                                                </Collapse>
                                            </TableCell >
                                        </TableRow >
                                    </React.Fragment >
                                ))}
                            </TableBody >
                        </Table >
                    </TableContainer >
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

            <AddStockIn open={isAddDialogOpen} onRefresh={() => fetchData()} onClose={() => setIsAddDialogOpen(false)} />
        </>
    );
};

export default StockInPage;
