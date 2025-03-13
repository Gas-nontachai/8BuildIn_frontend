"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/date-helper"

import { Visibility, Description, Search, Clear, Sort, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import {
    Chip, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TablePagination, TableRow, TextField,
    InputAdornment,
    Menu,
    MenuItem,
    Checkbox,
    ListItemText
} from "@mui/material";

import Loading from "@/app/components/Loading";
import { usePagination } from "@/context/PaginationContext";

import { PurchaseOrder, Employee } from '@/misc/types';
import { usePurchaseOrder, useEmployee } from "@/hooks/hooks";

const { getPurchaseOrderBy } = usePurchaseOrder();
const { getEmployeeBy } = useEmployee();

const TableListPO = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [search, setSearch] = useState<string>("");
    const [selectedPurchaseOrders, setSelectedPurchaseOrders] = useState<string>("");
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
    const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

    const [sort, setSort] = useState<{ name: string; order: "ASC" | "DESC" }>({
        name: "adddate",
        order: "DESC",
    });

    const statusOptions: {
        label: string;
        value: string;
    }[] = [
            { label: "รอดำเนินการ", value: "pending" },
            { label: "อนุมัติแล้ว", value: "approved" },
            { label: "ไม่อนุมัติ", value: "not-approved" },
            { label: "สั่งซื้อสำเร็จ", value: "success" },
        ];

    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
        statusOptions.map((option) => option.value)
    );

    useEffect(() => {
        fetchData();
        setFilterAnchorEl(null)
        setSortAnchorEl(null)
    }, [sort, selectedStatuses]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { docs: res } = await getPurchaseOrderBy({
                search: {
                    text: search,
                    columns: ["po_id"],
                    condition: "LIKE",
                },
                match: {
                    po_status: { $in: selectedStatuses }
                },
                sorter: [{ key: sort.name, order: sort.order }]
            });
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

    const toggleSort = (key: "name" | "order", value: string) => {
        setSort((prevSort) => {
            if (prevSort.name === value) {
                return {
                    ...prevSort,
                    order: prevSort.order === "ASC" ? "DESC" : "ASC",
                };
            } else {
                return {
                    name: value,
                    order: "ASC",
                };
            }
        });
    };

    const handleToggle = (value: string) => {
        const currentIndex = selectedStatuses.indexOf(value);
        const newSelected = [...selectedStatuses];

        if (currentIndex === -1) {
            newSelected.push(value);
        } else {
            newSelected.splice(currentIndex, 1);
        }

        setSelectedStatuses(newSelected);
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="flex gap-2 mb-5">
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="ค้นหารหัสใบสั่งซื้อ..."
                            className="w-64"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        onClick={() => fetchData()}
                                        className="cursor-pointer"
                                    >
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    fetchData();
                                }
                            }}
                        />

                        {/* Clear Button */}
                        {(search || selectedPurchaseOrders) && (
                            <button
                                className="bg-gray-200 p-2 rounded-md text-sm text-gray-700 flex items-center"
                                onClick={() => {
                                    setSearch('');
                                    setSelectedPurchaseOrders('');
                                }}
                            >
                                <Clear />
                            </button>
                        )}

                        {/* Filter Button & Menu */}
                        <div className="flex gap-2">
                            <Button
                                className="bg-gray-200 p-2 rounded-md text-sm text-gray-700 flex items-center gap-1"
                                onClick={(event) => setFilterAnchorEl(event.currentTarget)}
                                endIcon={<Sort />}
                            >
                                Filter
                            </Button>

                            <Menu
                                anchorEl={filterAnchorEl}
                                open={Boolean(filterAnchorEl)}
                                onClose={() => setFilterAnchorEl(null)}
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        onClick={() => handleToggle(option.value)}
                                    >
                                        <Checkbox checked={selectedStatuses.includes(option.value)} />
                                        <ListItemText primary={option.label} />
                                    </MenuItem>
                                ))}
                            </Menu>
                        </div>

                        {/* Sort Button & Menu */}
                        <div className="flex gap-2">
                            <Button
                                className="bg-gray-200 p-2 rounded-md text-sm text-gray-700 flex items-center gap-1"
                                onClick={(event) => setSortAnchorEl(event.currentTarget)}
                                endIcon={<Sort />}
                            >
                                Sort
                            </Button>

                            <Menu
                                anchorEl={sortAnchorEl}
                                open={Boolean(sortAnchorEl)}
                                onClose={() => setSortAnchorEl(null)}
                            >
                                <MenuItem onClick={() => toggleSort("name", "adddate")}>
                                    จัดเรียงตามวันที่
                                    {sort.name === "adddate" && (sort.order === "ASC" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
                                </MenuItem>

                                <MenuItem onClick={() => toggleSort("name", "po_id")}>
                                    จัดเรียงตามรหัสใบสั่งซื้อ
                                    {sort.name === "po_id" && (sort.order === "ASC" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>

                    <TableContainer style={{ minHeight: "24rem" }}>
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-200">
                                    <TableCell>#</TableCell>
                                    <TableCell>รหัส PO</TableCell>
                                    <TableCell>รหัส PR</TableCell>
                                    <TableCell>สถานะ PO</TableCell>
                                    <TableCell>หมายเหตุ</TableCell>
                                    <TableCell>เพิ่มโดย</TableCell>
                                    <TableCell>วันที่เพิ่ม</TableCell>
                                    <TableCell>ดูบิล</TableCell>
                                    <TableCell align="center">รายละเอียดใบสั่งซื้อ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {purchaseOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                    <TableRow key={item.po_id} hover>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>{item.po_id}</TableCell>
                                        <TableCell>{item.pr_id}</TableCell>
                                        <TableCell>
                                            {item.po_status === 'pending' ? (
                                                <span className="inline-flex items-center px-1 py-0.5 rounded-md text-[13px] font-[400] text-white bg-yellow-500">
                                                    รอดำเนินการ
                                                </span>
                                            ) : item.po_status === 'buying' ? (
                                                <span className="inline-flex items-center px-1 py-0.5 rounded-md text-[13px] font-[400] text-white bg-orange-500">
                                                    กำลังสั่งซื้อ
                                                </span>
                                            ) : item.po_status === 'success' ? (
                                                <span className="inline-flex items-center px-1 py-0.5 rounded-md text-[13px] font-[400] text-white bg-red-500">
                                                    สั่งซื้อสำเร็จ
                                                </span>
                                            ) : item.po_status === 'not-approved' ? (
                                                <span className="inline-flex items-center px-1 py-0.5 rounded-md text-[13px] font-[400] text-white bg-red-500">
                                                    ไม่อนุมัติ
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-1 py-0.5 rounded-md text-[13px] font-[400] text-black bg-gray-300">
                                                    {item.po_status}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>{item.po_note}</TableCell>
                                        <TableCell>{item.addby}</TableCell>
                                        <TableCell>{formatDate(item.adddate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                                        <TableCell>
                                            <Button color="info" size="small"><Description /> PDF</Button>
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
                                                    fontWeight: "bold",
                                                    boxShadow: 3,
                                                    transition: "all 0.3s ease",
                                                    "&:hover": {
                                                        boxShadow: 6,
                                                        transform: "scale(1.05)",
                                                    }
                                                }}
                                            >
                                                ดูรายละเอียด
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table >
                    </TableContainer >
                </>
            )
            }
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