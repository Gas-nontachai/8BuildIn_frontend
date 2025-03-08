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
    InputLabel,
    Divider,
    FormLabel
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import Swal from 'sweetalert2';

import useSupplier from "@/hooks/useSupplier";
import useStockIn from "@/hooks/useStockIn";
import { StockIn } from '@/misc/types';

const { getSupplierBy } = useSupplier();
const { insertStockIn } = useStockIn();

interface AddStockInProps {
    onClose: () => void;
    onRefresh: () => void;
    open: boolean;
}

const AddStockIn: React.FC<AddStockInProps> = ({ onClose, open, onRefresh }) => {
    const [formData, setFormData] = useState<StockIn>({
        stock_in_id: "",
        product: "",
        material: "",
        stock_in_price: 0,
        supplier_id: "",
        supplier_note: "",
        addby: "",
        adddate: ''
    });

    const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
    const [product, setProduct] = useState<{ product_name: string, product_quantity: number, product_price: number }[]>([]);
    const [material, setMaterial] = useState<{ material_name: string, material_quantity: number, material_price: number }[]>([]);
    const [isAddNote, setIsAddNote] = useState(false);

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
        };
        Swal.fire({
            title: 'กำลังดำเนินการ...',
            text: 'กรุณารอสักครู่',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            await onClose();
            await insertStockIn(insertData);
            setFormData({
                stock_in_id: "",
                product: "",
                material: "",
                stock_in_price: 0,
                supplier_id: "",
                supplier_note: "",
                addby: "",
                adddate: ""
            });
            setMaterial([]);
            setProduct([]);
            await onRefresh();
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'เพิ่มสต็อกเรียบร้อย',
                showConfirmButton: false,
                timer: 2000
            });

        } catch (error) {
            console.error("Error inserting stock:", error);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเพิ่มสต็อกได้',
                showConfirmButton: false,
                timer: 3000
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
        }
    }, [open]);

    const fetchSupplier = async () => {
        try {
            const { docs: res } = await getSupplierBy();
            setSuppliers(res.map(item => ({ id: item.supplier_id, name: item.supplier_name })))
        } catch (error) {
            console.error("Error fetching supplier data:", error);
            Swal.fire("Error", "ไม่สามารถดึงข้อมูลผู้จำหน่ายได้", "error");
        }
    };

    useEffect(() => {
        const calculate_price = () => {
            const totalProductPrice = product.reduce((sum, item) => sum + (Number(item.product_price) || 0), 0);
            const totalMaterialPrice = material.reduce((sum, item) => sum + (Number(item.material_price) || 0), 0);
            const totalPrice = totalProductPrice + totalMaterialPrice;

            setFormData(prev => ({ ...prev, stock_in_price: totalPrice }));
        };

        calculate_price();
    }, [product, material]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                เพิ่มข้อมูลการนำเข้าสต็อก
                <IconButton onClick={onClose} style={{ position: "absolute", right: 10, top: 10 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    <Grid size={8}>
                        <FormLabel component="legend" className="mb-2">ผู้จัดจำหน่าย <span className="text-red-500">*</span></FormLabel>
                        <FormControl fullWidth>
                            <Select
                                name="supplier_id"
                                value={formData.supplier_id}
                                onChange={handleChange}
                                size="small"
                            >
                                {suppliers.map((supplier) => (
                                    <MenuItem key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={3}>
                        <FormLabel component="legend" className="mb-2">ราคานำเข้าทั้งหมด <span className="text-red-500">*</span></FormLabel>
                        <TextField
                            fullWidth
                            type="number"
                            size="small"
                            value={formData.stock_in_price}
                            onChange={(e) => setFormData({ ...formData, stock_in_price: Number(e.target.value) })}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Button onClick={() => handleAddContact("product")} startIcon={<Add />} color="primary">
                            เพิ่มสินค้า
                        </Button>
                        <Button onClick={() => handleAddContact("material")} startIcon={<Add />} color="primary">
                            เพิ่มวัสดุ
                        </Button>
                        <Button onClick={() => setIsAddNote(true)} startIcon={<Add />} color="primary">
                            เพิ่มหมายเหตุ
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
                                mb: 1
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
                                mb: 1
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
                    <Grid size={12}>
                        {isAddNote && (
                            <div className="grid grid-cols-12">
                                <FormLabel component="legend">หมายเหตุ <span className="text-red-500">*</span></FormLabel>
                                <div className="relative flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md col-span-12">
                                    <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
                                        onClick={() => setIsAddNote(false)}
                                    >
                                        ✖
                                    </button>
                                    <input
                                        type="text"
                                        value={formData.supplier_note}
                                        onChange={(e) =>
                                            setFormData({ ...formData, supplier_note: e.target.value })
                                        }
                                        placeholder="เพิ่มหมายเหตุ..."
                                        className="w-full p-2 mt-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
                <Button onClick={handleSubmit} color="success" variant="contained">
                    บันทึก
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddStockIn;
