import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Close, Delete } from "@mui/icons-material";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    IconButton,
    Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, CircularProgress, FormHelperText
} from "@mui/material";

import { usePagination } from "@/context/PaginationContext";

import { ProductCategory } from '@/misc/types';
import useProductCategory from "@/hooks/useProductCategory";

const { insertProductCategory, getProductCategoryBy, deleteProductCategoryBy } = useProductCategory();

interface ManageProductCategoryProps {
    onClose: () => void;
    onRefresh: () => void;
    open: boolean;
}

const ManageProductCategory: React.FC<ManageProductCategoryProps> = ({ onClose, onRefresh, open }) => {
    const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
    const [loading, setLoading] = useState(false);
    const [productCategory, setProductCategory] = useState<ProductCategory>({
        product_category_id: '',
        product_category_name: ''
    });
    const [data, setData] = useState<ProductCategory[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { docs: res } = await getProductCategoryBy();
            setData(res);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleChange = (event: any) => {
        setProductCategory({
            ...productCategory,
            [event.target.name]: event.target.value
        });
    };

    const validateForm = () => {
        if (!productCategory.product_category_name.trim()) {
            setError('กรุณากรอกชื่อประเภทสินค้า');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return; 
        try {
            setLoading(true);
            await insertProductCategory(productCategory);
            await fetchData();
            setProductCategory({
                product_category_id: '',
                product_category_name: ''
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const onDelete = async (p_id: string) => {
        const result = await Swal.fire({
            title: "ยืนยันการลบ?",
            text: "คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "ใช่, ลบเลย!",
            cancelButtonText: "ยกเลิก",
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                await deleteProductCategoryBy({ product_category_id: p_id });
                await fetchData();
                Swal.fire("ลบสำเร็จ!", "หมวดหมู่ถูกลบเรียบร้อยแล้ว", "success");
            } catch (error) {
                console.log(error);
                Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบหมวดหมู่ได้", "error");
            }
            setLoading(false);
        }
    };


    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle>
                    จัดการประเภทสินค้า
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
                                name="product_category_name"
                                placeholder="ชื่อประเภทสินค้า *"
                                value={productCategory.product_category_name}
                                onChange={handleChange}
                                required
                                error={!!error}
                            />
                            {error && <FormHelperText error>{error}</FormHelperText>}
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
                                    <TableCell>ชื่อประเภทสินค้า</TableCell>
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
                                        <TableRow key={data.product_category_id} hover>
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{data.product_category_name}</TableCell>
                                            <TableCell>
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        startIcon={<Delete />}
                                                        onClick={() => onDelete(data.product_category_id)}
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
            </Dialog>
        </>
    );
};

export default ManageProductCategory;
