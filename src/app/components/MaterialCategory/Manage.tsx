import React, { useEffect, useState } from "react";
import { Close, Delete } from "@mui/icons-material";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    IconButton,
    Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, CircularProgress, FormLabel
} from "@mui/material";
import Swal from 'sweetalert2';

import { usePagination } from "@/context/PaginationContext";

import { MaterialCategory } from '@/misc/types';
import useMaterialCategory from "@/hooks/useMaterialCategory";

const { insertMaterialCategory, getMaterialCategoryBy, deleteMaterialCategoryBy } = useMaterialCategory();

interface ManageMaterialCategoryProps {
    onClose: () => void;
    onRefresh: () => void;
    open: boolean;
}

const ManageMaterialCategory: React.FC<ManageMaterialCategoryProps> = ({ onClose, onRefresh, open }) => {
    const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
    const [loading, setLoading] = useState(false)
    const [materialCategory, setMaterialCategory] = useState<MaterialCategory>({
        material_category_id: '',
        material_category_name: ''
    })
    const [data, setData] = useState<MaterialCategory[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const { docs: res } = await getMaterialCategoryBy()
            setData(res)
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    }

    const handleChange = (event: any) => {
        setMaterialCategory({
            ...materialCategory,
            [event.target.name]: event.target.value
        });
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);
            Swal.fire({
                icon: 'info',
                title: 'กำลังดำเนินการ...',
                text: 'กรุณารอสักครู่',
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            await insertMaterialCategory(materialCategory);
            await fetchData();
            setMaterialCategory({
                material_category_id: '',
                material_category_name: ''
            });
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'เพิ่มหมวดหมู่วัสดุสำเร็จแล้ว',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเพิ่มหมวดหมู่วัสดุได้',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (m_id: string) => {
        try {
            setLoading(true)
            await deleteMaterialCategoryBy({ material_category_id: m_id })
            await fetchData()
        } catch (error) {

        }
        setLoading(false)
    }
    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle>
                    จัดการประเภทวัสดุ
                    <IconButton onClick={onClose} style={{ position: "absolute", right: 10, top: 10 }}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={11}>
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                name="material_category_name"
                                placeholder="ชื่อประเภทวัสดุ *"
                                value={materialCategory.material_category_name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Button onClick={handleSubmit} color="success" fullWidth variant="contained">
                                บันทึก
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
                <Paper className="shadow-md p-6">
                    <TableContainer style={{ minHeight: "24rem" }}>
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-200">
                                    <TableCell>#</TableCell>
                                    <TableCell>ชื่อประเภทวัสดุ</TableCell>
                                    <TableCell align="center">จัดการ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            <div className="flex flex-col items-center text-[15px]">
                                                <CircularProgress />
                                                <span className="mt-2">กำลังโหลดข้อมูล...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => (
                                        <TableRow key={data.material_category_id} hover>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{data.material_category_name}</TableCell>
                                            <TableCell>
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        startIcon={<Delete />}
                                                        onClick={() => onDelete(data.material_category_id)}
                                                    >
                                                        ลบ
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={onChangePage}
                        onRowsPerPageChange={onChangeRowsPerPage}
                    />
                </Paper>
            </Dialog >
        </>
    );
};

export default ManageMaterialCategory;