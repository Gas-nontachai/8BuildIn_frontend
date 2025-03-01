import React, { useState } from "react";
import { Close } from "@mui/icons-material";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    IconButton,
    Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination
} from "@mui/material";

import { usePagination } from "@/context/PaginationContext";
import Swal from 'sweetalert2';

import useProduct from "@/hooks/useProduct";
import { ProductCategory } from '@/misc/types';
import useProductCategory from "@/hooks/useProductCategory";

const { insertProductCategory, getProductCategoryBy } = useProductCategory();

interface AddProductCategoryProps {
    onClose: () => void;
    open: boolean;
}

const AddProductCategory: React.FC<AddProductCategoryProps> = ({ onClose, open }) => {
    const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
    const [productCategory, setProductCategory] = useState<ProductCategory>({
        product_category_id: '',
        product_category_name: ''
    })
    const [data, setData] = useState<ProductCategory[]>([])

    const fetchData = async () => {
        const { docs: res } = await getProductCategoryBy()
        setData(res)
    }

    const handleChange = (event: any) => {
        setProductCategory({
            ...productCategory,
            [event.target.name]: event.target.value
        });
    }
    const handleSubmit = async () => {
        await insertProductCategory(productCategory)
        Swal.fire({
            title: "สำเร็จ",
            text: "เพิ่มประเภทสินค้า",
            timer: 1500
        })
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
                                placeholder="ชื่อประเภทสินค้า"
                                value={productCategory.product_category_name}
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
                                    <TableCell>ชื่อประเภทสินค้า</TableCell>
                                    <TableCell align="center">จัดการ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data) => (
                                    <TableRow hover>
                                        <TableCell>asd</TableCell>
                                        <TableCell>asd </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center gap-2">
                                                {/* <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<ModeEdit />}
                                            onClick={() => {
                                                setIsUpdateDialogOpen(true);
                                                supplier_id.current = supplier.supplier_id;
                                            }}
                                        >
                                            แก้ไข
                                        </Button> */}
                                                {/* <Button variant="contained" color="error" startIcon={<Delete />} onClick={() => onDelete(supplier.supplier_id)}>
                                            ลบ
                                        </Button> */}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
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

export default AddProductCategory;