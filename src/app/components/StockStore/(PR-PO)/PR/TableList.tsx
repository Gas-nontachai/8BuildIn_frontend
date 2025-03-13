"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/date-helper"

import { Visibility, Description } from "@mui/icons-material";
import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TablePagination, TextField, Button
} from "@mui/material";

import Loading from "@/app/components/Loading";
import { usePagination } from "@/context/PaginationContext";

import { PurchaseRequest, Employee } from '@/misc/types';
import { usePurchaseRequest, useEmployee } from "@/hooks/hooks";

const { getPurchaseRequestBy } = usePurchaseRequest();
const { getEmployeeBy } = useEmployee();

const TableListPR = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
    const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
    const [employee, setEmployee] = useState<Employee[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { docs: res } = await getPurchaseRequestBy();
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
                            placeholder="ค้นหารหัสคำขอซื้อ..."
                            className="w-64"
                        />
                    </div>
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
            )}
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