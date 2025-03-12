"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import { formatDate } from "@/utils/date-helper"

import { Check, Close, MoreVert, EventNote } from "@mui/icons-material";
import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TablePagination, Chip, IconButton, Menu, MenuItem
} from "@mui/material";

import Loading from "@/app/components/Loading";
import { usePagination } from "@/context/PaginationContext";

import { PurchaseRequest } from '@/misc/types';
import { usePurchaseRequest } from "@/hooks/hooks";

const { getPurchaseRequestBy, updatePurchaseRequestBy } = usePurchaseRequest();

const TableListPR = () => {
    const router = useRouter();
    const [purchaserequest, setPurchaseRequest] = useState<PurchaseRequest>({
        pr_id: '',
        pr_status: '',
        pr_note: '',
        product: '',
        material: '',
    });
    const [loading, setLoading] = useState(false);
    const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
    const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<PurchaseRequest | null>(null);
    const pr_id = useRef('');

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>, purchaserequest: PurchaseRequest) => {
        setAnchorEl(event.currentTarget);
        setSelected(purchaserequest);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelected(null);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { docs: res } = await getPurchaseRequestBy();
            setPurchaseRequests(res);
        }
        catch (error) {
            console.log("Error fetching Purchase Request:", error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleNotApprove = async (pr_id: string) => {
        try {
            const { isConfirmed } = await Swal.fire({
                title: 'ไม่อนุมัติ PR นี้?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ใช่',
                cancelButtonText: 'ไม่',
            });
            if (isConfirmed) {
                const updateStatus = {
                    ...purchaserequest,
                    pr_id: pr_id,
                    pr_status: 'not-appreove'
                }
                await updatePurchaseRequestBy(updateStatus);
            }
        } catch (error) {
            console.log("Error disapprove PR:", error);
        }
    };

    const handleApprove = async (pr_id: string) => {
        try {
            const { isConfirmed } = await Swal.fire({
                title: 'อนุมัติ PR นี้?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ใช่',
                cancelButtonText: 'ไม่',
            });
            if (isConfirmed) {
                const updateStatus = {
                    ...purchaserequest,
                    pr_id: pr_id,
                    pr_status: 'approve'
                }
                await updatePurchaseRequestBy(updateStatus);
            }
        }
        catch (error) {
            console.log("Error approve PR:", error);
        }
    }

    const handleDetail = (pr_id: string) => {
        router.push('/purchase-request/detail/?pr_id=' + pr_id);
    }


    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <TableContainer style={{ minHeight: "24rem" }}>
                    <Table>
                        <TableHead>
                            <TableRow className="bg-gray-200">
                                <TableCell>#</TableCell>
                                <TableCell>รหัส PR</TableCell>
                                <TableCell>สถานะ PR</TableCell>
                                <TableCell>เพิ่มโดย</TableCell>
                                <TableCell>วันที่เพิ่ม</TableCell>
                                <TableCell>ดูบิล</TableCell>
                                <TableCell align="center">จัดการคำขอซื้อ</TableCell>
                            </TableRow >
                        </TableHead >
                        <TableBody>
                            {purchaseRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                <TableRow key={item.pr_id} hover>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{item.pr_id}</TableCell>
                                    <TableCell>
                                        {item.pr_status === 'pending' ? (
                                            <span className="inline-block px-2 py-0.5 rounded-xl text-[15px] font-[400] text-white bg-yellow-500">
                                                รอดำเนินการ
                                            </span>
                                        ) : item.pr_status === 'success' ? (
                                            <span className="inline-block px-2 py-0.5 rounded-xl text-[15px] font-[400] text-white bg-green-500">
                                                สำเร็จ
                                            </span>
                                        ) : item.pr_status === 'not-approved' ? (
                                            <span className="inline-block px-2 py-0.5 rounded-xl text-[15px] font-[400] text-white bg-red-500">
                                                ไม่อนุมัติ
                                            </span>
                                        ) : (
                                            <span className="inline-block px-2 py-0.5 rounded-xl text-[15px] font-[400] text-black bg-gray-300">
                                                {item.pr_status}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>{item.addby}</TableCell>
                                    <TableCell>{formatDate(item.adddate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleClickMenu(e, item)}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleCloseMenu}
                                        >
                                            <MenuItem onClick={() => {
                                                pr_id.current = selected?.pr_id!;
                                                handleDetail(pr_id.current);
                                                handleCloseMenu();
                                            }}>
                                                <EventNote className="mr-2" /> ดูรายละเอียด
                                            </MenuItem>
                                            <MenuItem onClick={() => {
                                                pr_id.current = selected?.pr_id!;
                                                handleApprove(pr_id.current);
                                                handleCloseMenu();
                                            }}>
                                                <Check className="mr-2" /> อนุมัติ
                                            </MenuItem>
                                            <MenuItem onClick={() => {
                                                pr_id.current = selected?.pr_id!;
                                                handleNotApprove(pr_id.current);
                                                handleCloseMenu();
                                            }}>
                                                <Close className="mr-2" /> ไม่อนุมัติ
                                            </MenuItem>
                                        </Menu>
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