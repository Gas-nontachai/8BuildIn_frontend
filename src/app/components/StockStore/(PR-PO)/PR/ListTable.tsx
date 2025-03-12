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

const ListTablePR = () => {
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
                                <TableCell>หมายเหตุ</TableCell>
                                <TableCell>เพิ่มโดย</TableCell>
                                <TableCell>วันที่เพิ่ม</TableCell>
                                <TableCell>ดูบิล</TableCell>
                                <TableCell>อนุมัติ</TableCell>
                            </TableRow >
                        </TableHead >
                        <TableBody>
                            {purchaseRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                <TableRow key={item.pr_id} hover>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{item.pr_id}</TableCell>
                                    <TableCell>
                                        {item.pr_status === 'pending' ? (
                                            <Chip label="Pending" color="warning" size="small" />
                                        ) : item.pr_status === 'success' ? (
                                            <Chip label="Success" color="success" size="small" />
                                        ) : (
                                            <Chip label={item.pr_status} />
                                        )}
                                    </TableCell>
                                    <TableCell>{item.pr_note}</TableCell>
                                    <TableCell>{item.addby}</TableCell>
                                    <TableCell>{formatDate(item.adddate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>
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
export default ListTablePR