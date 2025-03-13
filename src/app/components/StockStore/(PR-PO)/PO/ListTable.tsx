"use client";
import { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';
import { formatDate } from "@/utils/date-helper"

import { Check, Close, MoreVert } from "@mui/icons-material";
import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TablePagination, Chip, IconButton, Menu, MenuItem
} from "@mui/material";

import Loading from "@/app/components/Loading";
import { usePagination } from "@/context/PaginationContext";

import { PurchaseOrder } from '@/misc/types';
import { usePurchaseOrder } from "@/hooks/hooks";

const { getPurchaseOrderBy, updatePurchaseOrderBy } = usePurchaseOrder();

const ListTablePO = () => {
    const [purchaseorder, setPurchaseOrder] = useState<PurchaseOrder>({
        po_id: '',
        pr_id: '',
        supplier_id: '',
        po_status: '',
        po_note: '',
    });
    const [loading, setLoading] = useState(false);
    const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<PurchaseOrder | null>(null);
    const po_id = useRef('');

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>, purchaseorder: PurchaseOrder) => {
        setAnchorEl(event.currentTarget);
        setSelected(purchaseorder);
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
            const { docs: res } = await getPurchaseOrderBy();
            setPurchaseOrders(res);
        }
        catch (error) {
            console.log("Error fetching Purchase Request:", error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleNotApprove = async (po_id: string) => {
        try {
            const { isConfirmed } = await Swal.fire({
                title: 'ไม่อนุมัติ PO นี้?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ใช่',
                cancelButtonText: 'ไม่',
            });
            if (isConfirmed) {
                const updateStatus = {
                    ...purchaseorder,
                    po_id: po_id,
                    pr_status: 'not-appreove'
                }
                await updatePurchaseOrderBy(updateStatus);
            }
        } catch (error) {
            console.log("Error disapprove PR:", error);
        }
    };

    const handleApprove = async (po_id: string) => {
        try {
            const { isConfirmed } = await Swal.fire({
                title: 'อนุมัติ PO นี้?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ใช่',
                cancelButtonText: 'ไม่',
            });
            if (isConfirmed) {
                const updateStatus = {
                    ...purchaseorder,
                    po_id: po_id,
                    pr_status: 'approve'
                }
                await updatePurchaseOrderBy(updateStatus);
            }
        }
        catch (error) {
            console.log("Error approve PR:", error);
        }
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {purchaseOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                <TableRow key={item.po_id} hover>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{item.po_id}</TableCell>
                                    {/* <TableCell>
                                        {item.pr_status === 'pending' ? (
                                            <Chip label="Pending" color="warning" size="small" />
                                        ) : item.pr_status === 'success' ? (
                                            <Chip label="Success" color="success" size="small" />
                                        ) : (
                                            <Chip label={item.pr_status} />
                                        )}
                                    </TableCell>
                                    <TableCell>{item.pr_note}</TableCell> */}
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
                                                po_id.current = selected?.po_id!;
                                                handleApprove(po_id.current);
                                                handleCloseMenu();
                                            }}>
                                                <Check className="mr-2" /> อนุมัติ
                                            </MenuItem>
                                            <MenuItem onClick={() => {
                                                po_id.current = selected?.po_id!;
                                                handleNotApprove(po_id.current);
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
                count={purchaseOrders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
            />
        </>
    )
}
export default ListTablePO