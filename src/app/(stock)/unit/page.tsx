"use client";
import { useEffect, useRef, useState } from "react";
import { ModeEdit, Delete, Add, MoreVert } from "@mui/icons-material";
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, CircularProgress, Menu, MenuItem, IconButton } from "@mui/material";
import { usePagination } from "@/context/PaginationContext";

import AddUnit from "@/app/components/Unit/Add";
import UpdateUnit from "@/app/components/Unit/Update";

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
            <div className="flex justify-between mb-4" >
                <span className="text-xl font-[400]" >ข้อมูลสต็อกเข้า</span>
                <Button variant="contained" color="primary" onClick={() => setIsAddDialogOpen(true)} startIcon={<Add />}>
                    เพิ่มสต็อกเข้า
                </Button>
            </div>

            {
                loading ? (
                    <div className="flex justify-center flex-col items-center py-4 text-[15px]" >
                        <CircularProgress />
                        < span className="mt-3" > กำลังโหลดข้อมูล...</span>
                    </div>
                ) : (
                    <Paper className="shadow-md" >
                        <TableContainer style={{ minHeight: "24rem" }}>
                            <Table>
                                <TableHead>
                                    <TableRow className="bg-gray-200" >
                                        <TableCell># </TableCell>
                                        < TableCell > หน่วย (th) </TableCell>
                                        < TableCell > หน่วย (en) </TableCell>
                                        < TableCell align="center" > จัดการ </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {unit.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((unit, index) => (
                                        <TableRow key={unit.unit_id} hover >
                                            <TableCell>{index + 1} </TableCell>
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
                    </Paper>
                )}

            <AddUnit open={isAddDialogOpen} onRefresh={() => fetchData()} onClose={() => setIsAddDialogOpen(false)} />
            <UpdateUnit open={isUpdateDialogOpen} unit_id={unit_id.current} onRefresh={() => fetchData()} onClose={() => setIsUpdateDialogOpen(false)} />

        </>
    );
};

export default UnitPage;
