'use client';

import React, { useEffect, useState } from "react";
import { Close, Add, DeleteForeverRounded } from "@mui/icons-material";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    IconButton,
    FormControl,
    Select,
    MenuItem,
    FormLabel,
    CircularProgress
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import Swal from 'sweetalert2';

import useSupplier from "@/hooks/useSupplier";
import useStockIn from "@/hooks/useStockIn";
import Loading from "../Loading";
import { StockIn } from '@/misc/types';

const { getSupplierBy } = useSupplier();
const { getStockInByID, updateStockInBy } = useStockIn();

interface UpdateStockInProps {
    onClose: () => void;
    onRefresh: () => void;
    open: boolean;
    stock_in_id: string;
}

const UpdateStockIn: React.FC<UpdateStockInProps> = ({ onClose, onRefresh, open, stock_in_id }) => {
    const [formData, setFormData] = useState<StockIn>({
        stock_in_id: '',
        product: '',
        material: '',
        stock_in_price: 0,
        stock_in_note: '',
        supplier_id: '',
        supplier_note: '',
    });

    const [loading, setLoading] = useState(false)
    const [note, setNote] = useState('');
    const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
    const [product, setProduct] = useState<{ product_name: string, product_quantity: number, product_price: number }[]>([]);
    const [material, setMaterial] = useState<{ material_name: string, material_quantity: number, material_price: number }[]>([]);

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        const insertData = {
            ...formData,
            product: JSON.stringify(product),
            material: JSON.stringify(material),
            stock_in_note: note
        };
        try {
            onClose();
            Swal.fire({
                title: 'กำลังเพิ่มข้อมูล...',
                text: 'กรุณารอสักครู่',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            await updateStockInBy(insertData);
            setFormData({
                stock_in_id: '',
                product: '',
                material: '',
                stock_in_price: 0,
                stock_in_note: '',
                supplier_id: '',
                supplier_note: '',
            });
            setMaterial([]);
            setProduct([]);
            onRefresh();
            Swal.fire({
                title: 'สำเร็จ!',
                text: 'เพิ่มสินค้าเข้าสต็อกเรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            console.error("Error inserting stock:", error);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถเพิ่มสินค้าเข้าสต็อกได้ กรุณาลองใหม่อีกครั้ง',
                icon: 'error',
                confirmButtonText: 'ลองอีกครั้ง'
            });
        }
    };

    const handleDataChange = (index: number, key: string, value: string, type: "product" | "material") => {
        if (type === "product") {
            const updatedProductList = [...product];
            updatedProductList[index] = { ...updatedProductList[index], [key]: value };
            setProduct(updatedProductList);
        } else {
            const updatedMaterialList = [...material];
            updatedMaterialList[index] = { ...updatedMaterialList[index], [key]: value };
            setMaterial(updatedMaterialList);
        }
    };

    const handleAddContact = (type: "product" | "material") => {
        if (type === "product") {
            setProduct([...product, { product_name: "", product_quantity: 0, product_price: 0 }]);
        } else {
            setMaterial([...material, { material_name: "", material_quantity: 0, material_price: 0 }]);
        }
    };

    const handleRemoveContact = (index: number, type: "product" | "material") => {
        if (type === "product") {
            setProduct(product.filter((_, i) => i !== index));
        } else {
            setMaterial(material.filter((_, i) => i !== index));
        }
    };

    useEffect(() => {
        if (open) {
            fetchSupplier();
            fetchData();
        }
    }, [open]);

    const fetchSupplier = async () => {
        try {
            setLoading(true)
            const { docs: res } = await getSupplierBy();
            setSuppliers(res.map(item => ({ id: item.supplier_id, name: item.supplier_name })))
        } catch (error) {
            console.error("Error fetching supplier data:", error);
            Swal.fire("Error", "ไม่สามารถดึงข้อมูลผู้จำหน่ายได้", "error");
        }
        setLoading(false)
    };

    const fetchData = async () => {
        try {
            const res = await getStockInByID({ stock_in_id: stock_in_id });
            setFormData(res)
            setMaterial(JSON.parse(res.material))
            setProduct(JSON.parse(res.product))
        } catch (error) {
            console.error("Error fetching supplier data:", error);
            Swal.fire("Error", "ไม่สามารถดึงข้อมูลผู้จำหน่ายได้", "error");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                เพิ่มข้อมูลการนำเข้าสต็อก
                <IconButton onClick={onClose} style={{ position: "absolute", right: 10, top: 10 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            {loading ? (
                <Loading />
            ) : (
                <DialogContent sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        <Grid size={8}>
                            <FormLabel component="legend">ผู้จัดจำหน่าย <span className="text-red-500">*</span></FormLabel>
                            <FormControl fullWidth>
                                <Select
                                    name="supplier_id"
                                    size="small"
                                    value={formData.supplier_id}
                                    onChange={handleChange}
                                >
                                    {suppliers.map((supplier) => (
                                        <MenuItem key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={4}>
                            <FormLabel component="legend">ราคานำเข้าทั้งหมด <span className="text-red-500">*</span></FormLabel>
                            <TextField
                                fullWidth
                                type="number"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                                value={formData.stock_in_price}
                                onChange={(e) => setFormData({ ...formData, stock_in_price: Number(e.target.value) })}
                            />
                        </Grid>
                        <Grid size={12}>
                            <FormLabel component="legend">หมายเหตุ (ไม่บังคับ) </FormLabel>
                            <textarea
                                value={note}
                                onChange={(e) =>
                                    setNote(e.target.value)
                                }
                                placeholder="เพิ่มหมายเหตุ..."
                                className="w-full p-2 mt-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Button onClick={() => handleAddContact("product")} startIcon={<Add />} color="primary">
                                เพิ่มสินค้า
                            </Button>
                            <Button onClick={() => handleAddContact("material")} startIcon={<Add />} color="primary">
                                เพิ่มวัสดุ
                            </Button>
                        </Grid>
                        {product.length > 0 && (
                            <>
                                <FormLabel component="legend">สินค้า <span className="text-red-500">*</span></FormLabel>
                            </>
                        )}
                        <Grid size={12}>
                            {product.map((contact, index) => (
                                <Grid container spacing={2} key={index} sx={{
                                    mb: 1.5
                                }}>
                                    <Grid size={5}>
                                        <TextField
                                            label="ชื่อสินค้า"
                                            size="small"
                                            fullWidth
                                            value={contact.product_name}
                                            onChange={(e) => handleDataChange(index, "product_name", e.target.value, "product")}
                                        />
                                    </Grid>
                                    <Grid size={3}>
                                        <TextField
                                            label="จำนวน"
                                            size="small"
                                            fullWidth
                                            value={contact.product_quantity}
                                            type="number"
                                            onChange={(e) => handleDataChange(index, "product_quantity", e.target.value, "product")}
                                        />
                                    </Grid>
                                    <Grid size={3}>
                                        <TextField
                                            label="ราคาทั้งหมด"
                                            size="small"
                                            fullWidth
                                            value={contact.product_price}
                                            type="number"
                                            onChange={(e) => handleDataChange(index, "product_price", e.target.value, "product")}
                                        />
                                    </Grid>
                                    <Grid size={1}>
                                        <IconButton onClick={() => handleRemoveContact(index, "product")} color="error">
                                            <DeleteForeverRounded />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                        {material.length > 0 && (
                            <>
                                <FormLabel component="legend">วัสดุ <span className="text-red-500">*</span></FormLabel>
                            </>
                        )}
                        <Grid size={12}>
                            {material.map((contact, index) => (
                                <Grid container spacing={2} key={index} sx={{
                                    mb: 1.5
                                }}>
                                    <Grid size={5}>
                                        <TextField
                                            label="ชื่อวัสดุ"
                                            size="small"
                                            fullWidth
                                            value={contact.material_name}
                                            onChange={(e) => handleDataChange(index, "material_name", e.target.value, "material")}
                                        />
                                    </Grid>
                                    <Grid size={3}>
                                        <TextField
                                            label="จำนวน"
                                            size="small"
                                            fullWidth
                                            value={contact.material_quantity}
                                            type="number"
                                            onChange={(e) => handleDataChange(index, "material_quantity", e.target.value, "material")}
                                        />
                                    </Grid>
                                    <Grid size={3}>
                                        <TextField
                                            label="ราคาทั้งหมด"
                                            size="small"
                                            fullWidth
                                            value={contact.material_price}
                                            type="number"
                                            onChange={(e) => handleDataChange(index, "material_price", e.target.value, "material")}
                                        />
                                    </Grid>
                                    <Grid size={1}>
                                        <IconButton onClick={() => handleRemoveContact(index, "material")} color="error">
                                            <DeleteForeverRounded />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </DialogContent>
            )
            }
            <DialogActions sx={{ justifyContent: "center", marginBottom: 3 }}>
                <Button onClick={handleSubmit} color="success" variant="contained">
                    บันทึก
                </Button>
            </DialogActions>
        </Dialog >
    );
};

export default UpdateStockIn;
