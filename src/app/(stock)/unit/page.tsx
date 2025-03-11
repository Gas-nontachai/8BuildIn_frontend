"use client";
import { useEffect, useRef, useState } from "react";
import { MoreVert, Store, Delete, Add, Home, ModeEdit, Storage } from "@mui/icons-material";
import {
    MenuItem, Menu, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Breadcrumbs, Typography, Stack, Link, IconButton
} from "@mui/material";
import { usePagination } from "@/context/PaginationContext";
import Swal from 'sweetalert2';


import AddUnit from "@/app/components/Unit/Add";
import UpdateUnit from "@/app/components/Unit/Update";
import Loading from "@/app/components/Loading";

import useUnit from "@/hooks/useUnit";
import { Unit } from '@/misc/types';

const { getUnitBy, deleteUnitBy } = useUnit();

const UnitPage = () => {
    const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
    const [loading, setLoading] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [unit, setUnit] = useState<Unit[]>([]);
    const unit_id = useRef('')
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selected, setSelected] = useState<Unit | null>(null);

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>, unit: Unit) => {
        setAnchorEl(event.currentTarget);
        setSelected(unit);
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
            const { docs: res } = await getUnitBy();
            setUnit(res);
        } catch (error) {
            console.error("Error fetching Unit:", error);
        }
        setLoading(false);
    };

    const onDelete = async (unit_id: string) => {
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
                await deleteUnitBy({ unit_id: unit_id })
                Swal.fire("ลบแล้ว!", "ข้อมูลผู้จัดจำหน่ายถูกลบเรียบร้อยแล้ว", "success");
                await fetchData();
            } catch (error) {
                console.error("Error deleting supplier:", error);
            }
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4" >
                <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
                    <Link underline="hover" href="/product">
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
                            <Store fontSize="small" />
                            <Typography variant="body1" color="primary">ข้อมูลสินค้า</Typography>
                        </Stack>
                    </Link>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Storage fontSize="small" />
                        <Typography variant="body1" color="text.secondary">หน่วยสินค้า</Typography>
                    </Stack>
                </Breadcrumbs>
                <Button variant="contained" color="success" onClick={() => setIsAddDialogOpen(true)} startIcon={<Add />}>
                    เพิ่มสต็อกเข้า
                </Button>
            </div>
            {
                loading ? (
                    <Loading />
                ) : (
                    <>
                        <TableContainer style={{ minHeight: "24rem" }}>
                            <Table>
                                <TableHead>
                                    <TableRow className="bg-gray-200" >
                                        <TableCell># </TableCell>
                                        < TableCell > หน่วย (th) </TableCell>
                                        < TableCell > หน่วย (en) </TableCell>
                                        < TableCell> จัดการ </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {unit.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((unit, index) => (
                                        <TableRow key={unit.unit_id} hover >
                                            <TableCell>{page * rowsPerPage + index + 1} </TableCell>
                                            < TableCell >{unit.unit_name_th}</TableCell>
                                            < TableCell >{unit.unit_name_en}</TableCell>
                                            < TableCell >
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleClickMenu(e, unit)}
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
                                                        unit_id.current = selected?.unit_id!;
                                                        handleCloseMenu();
                                                    }}>
                                                        <ModeEdit className="mr-2" /> แก้ไข
                                                    </MenuItem>
                                                    <MenuItem onClick={() => {
                                                        onDelete(selected?.unit_id!);
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
                            count={unit.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={onChangePage}
                            onRowsPerPageChange={onChangeRowsPerPage}
                        />
                    </>
                )}
            <AddUnit open={isAddDialogOpen} onRefresh={() => fetchData()} onClose={() => setIsAddDialogOpen(false)} />
            <UpdateUnit open={isUpdateDialogOpen} unit_id={unit_id.current} onRefresh={() => fetchData()} onClose={() => setIsUpdateDialogOpen(false)} />
        </>
    );
};

export default UnitPage;
