"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/date-helper"

import { Visibility, Description, Search, Clear, Sort, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TablePagination, TextField, Button,
    InputAdornment,
    FormControl,
    Autocomplete,
    Menu,
    MenuItem,
    ListItemText,
    Checkbox,
    Box,
} from "@mui/material";

import Loading from "@/app/components/Loading";
import { usePagination } from "@/context/PaginationContext";

import { PurchaseRequest, Employee } from '@/misc/types';
import { usePurchaseRequest, useEmployee } from "@/hooks/hooks";
import { pdf } from '@react-pdf/renderer';
import PR from "@/app/components/StockStore/(PDF)/PR";

const { getPurchaseRequestBy } = usePurchaseRequest();
const { getEmployeeBy } = useEmployee();

const TableListPR = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
    const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
    const [employee, setEmployee] = useState<Employee[]>([]);
    const [search, setSearch] = useState<string>("");
    const [selectedPurchaseRequest, setSelectedPurchaseRequest] = useState<string>("");
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
    }, [sort, selectedStatuses]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { docs: res } = await getPurchaseRequestBy({
                search: {
                    text: search,
                    columns: ["pr_id"],
                    condition: "LIKE",
                },
                match: {
                    pr_status: { $in: selectedStatuses }
                },
                sorter: [{ key: sort.name, order: sort.order }]
            });
            setPurchaseRequests(res);
            const emp_arr = res.map((item) => item.addby);
            const { docs: emp } = await getEmployeeBy({ match: { $in: emp_arr } });
            setEmployee(emp);
        }
        catch (error) {
            console.log("Error fetching Purchase Request:", error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleDetail = (pr_id: string) => {
        router.push('/purchase-request/detail/?pr_id=' + pr_id);
    }

    const getEmployeeName = (id: any) => {
        const emp = employee.find(e => e.employee_id === id);
        return emp ? `${emp.employee_firstname} ${emp.employee_lastname}` : "-";
    };

    const openPDF = async (purchaseRequest: PurchaseRequest) => {
        console.log(purchaseRequest);
        try {
            const blob = await pdf(<PR prData={purchaseRequest} />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

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
            <div className="flex gap-2 mb-5">
                {/* Search Field */}
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="ค้นหารหัสคำขอซื้อ..."
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
                {(search || selectedPurchaseRequest) && (
                    <button
                        className="bg-gray-200 p-2 rounded-md text-sm text-gray-700 flex items-center"
                        onClick={() => {
                            setSearch('');
                            setSelectedPurchaseRequest('');
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

                        <MenuItem onClick={() => toggleSort("name", "pr_id")}>
                            จัดเรียงตามรหัสใบขอซื้อ
                            {sort.name === "pr_id" && (sort.order === "ASC" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
                        </MenuItem>
                    </Menu>
                </div>
            </div>

            {
                loading ? (
                    <Loading />
                ) : (
                    <>
                        <TableContainer style={{ minHeight: "24rem" }}>
                            <Table>
                                <TableHead>
                                    <TableRow className="bg-gray-200">
                                        <TableCell>#</TableCell>
                                        <TableCell>รหัส PR</TableCell>
                                        <TableCell>สถานะ PR</TableCell>
                                        <TableCell>เพิ่มโดย</TableCell>
                                        <TableCell>วันที่เพิ่ม</TableCell>
                                        <TableCell>อัพเดทล่าสุด</TableCell>
                                        <TableCell>ดูบิล</TableCell>
                                        <TableCell align="center">รายละเอียดคำขอซื้อ</TableCell>
                                    </TableRow >
                                </TableHead >
                                <TableBody>
                                    {purchaseRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                        <TableRow key={item.pr_id} hover>
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{item.pr_id}</TableCell>
                                            <TableCell>
                                                {item.pr_status === 'pending' ? (
                                                    <span className="inline-block px-1 py-0.5 rounded-md text-[13px] font-[400] text-white bg-yellow-500">
                                                        รอดำเนินการ
                                                    </span>
                                                ) : item.pr_status === 'approved' ? (
                                                    <span className="inline-block px-1 py-0.5 rounded-md text-[13px] font-[400] text-white bg-green-600">
                                                        อนุมัติแล้ว
                                                    </span>
                                                ) : item.pr_status === 'not-approved' ? (
                                                    <span className="inline-block px-1 py-0.5 rounded-md text-[13px] font-[400] text-white bg-red-500">
                                                        ไม่อนุมัติ
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-1 py-0.5 rounded-md text-[13px] font-[400] text-black bg-gray-300">
                                                        {item.pr_status}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>{getEmployeeName(item.addby)}</TableCell>
                                            <TableCell>{formatDate(item.lastupdate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                                            <TableCell>
                                                {formatDate(item.adddate, 'dd/MM/yyyy HH:mm:ss')}
                                            </TableCell>
                                            <TableCell>
                                                <Button color="info" size="small"><Description /> PDF</Button>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    onClick={() => handleDetail(item.pr_id)}
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
                count={purchaseRequests.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
            />
        </>
    )
}
export default TableListPR