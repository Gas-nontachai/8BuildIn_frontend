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
    FormLabel,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import Swal from 'sweetalert2';

import { decimalFix } from "@/utils/number-helper"
import { useSupplier, useStockIn, useUnit } from "@/hooks/hooks";
import { StockIn } from '@/misc/types';

const { getSupplierBy } = useSupplier();
const { insertStockIn } = useStockIn();
const { getUnitBy } = useUnit();

interface AddStockInProps {
    onClose: () => void;
    onRefresh: () => void;
    open: boolean;
}

const AddStockIn: React.FC<AddStockInProps> = ({ onClose, open, onRefresh }) => {
    const [formData, setFormData] = useState<StockIn>({
        stock_in_id: '',
        product: '',
        material: '',
        stock_in_price: 0,
        stock_in_note: '',
        supplier_id: '',
    });

    const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
    const [unit, setUnit] = useState<{ id: string; name: string }[]>([]);
    const [product, setProduct] = useState<{ product_name: string, product_quantity: number, unit_id: string, product_price: number }[]>([]);
    const [material, setMaterial] = useState<{ material_name: string, material_quantity: number, unit_id: string, material_price: number }[]>([]);

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
                stock_in_id: '',
                product: '',
                material: '',
                stock_in_price: 0,
                stock_in_note: '',
                supplier_id: '',
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

    const handleAddData = (type: "product" | "material") => {
        if (type === "product") {
            setProduct([...product, { product_name: "", product_quantity: 0, unit_id: '', product_price: 0 }]);
        } else {
            setMaterial([...material, { material_name: "", material_quantity: 0, unit_id: '', material_price: 0 }]);
        }
    };

    const handleRemoveData = (index: number, type: "product" | "material") => {
        if (type === "product") {
            setProduct(product.filter((_, i) => i !== index));
        } else {
            setMaterial(material.filter((_, i) => i !== index));
        }
    };

    useEffect(() => {
        if (open) {
            fetchSupplier();
            fetchUnit()
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

    const fetchUnit = async () => {
        try {
            const { docs: res } = await getUnitBy();
            setUnit(res.map(item => ({ id: item.unit_id, name: `${item.unit_name_th}(${item.unit_name_en})` })))
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
                    <Grid size={4}>
                        <FormLabel component="legend" className="mb-2">ราคานำเข้าทั้งหมด <span className="text-red-500">*</span></FormLabel>
                        <Typography variant="body1">
                            ราคานำเข้าทั้งหมด {decimalFix(formData.stock_in_price || "0")} บาท
                        </Typography>
                    </Grid>
                    <Grid size={12}>
                        <FormLabel component="legend">หมายเหตุ (ไม่บังคับ) </FormLabel>
                        <textarea
                            value={formData.stock_in_note}
                            onChange={(e) =>
                                setFormData({ ...formData, stock_in_note: e.target.value })
                            }
                            placeholder="เพิ่มหมายเหตุ..."
                            className="w-full p-2 mt-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Button onClick={() => handleAddData("product")} startIcon={<Add />} color="primary">
                            เพิ่มสินค้า
                        </Button>
                        <Button onClick={() => handleAddData("material")} startIcon={<Add />} color="primary">
                            เพิ่มวัสดุ
                        </Button>
                    </Grid>
                    {product.length > 0 && (
                        <>
                            <FormLabel component="legend">สินค้า <span className="text-red-500">*</span></FormLabel>
                        </>
                    )}
                    <Grid size={12}>
                        {product.map((product, index) => (
                            <Grid container spacing={2} key={index} sx={{
                                mb: 1
                            }}>
                                <Grid size={3}>
                                    <TextField
                                        label="ชื่อสินค้า"
                                        size="small"
                                        fullWidth
                                        value={product.product_name}
                                        onChange={(e) => handleDataChange(index, "product_name", e.target.value, "product")}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <TextField
                                        label="จำนวน"
                                        size="small"
                                        fullWidth
                                        value={product.product_quantity}
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        onChange={(e) => handleDataChange(index, "product_quantity", e.target.value, "product")}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id={`unit-label-${index}`}>หน่วย</InputLabel>
                                        <Select
                                            labelId={`unit-label-${index}`}
                                            name="unit_id"
                                            value={product.unit_id}
                                            label="หน่วย"
                                            onChange={(e) => handleDataChange(index, "unit_id", e.target.value, "product")}
                                        >
                                            {unit.map((unit) => (
                                                <MenuItem key={unit.id} value={unit.id}>
                                                    {unit.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                </Grid>
                                <Grid size={2}>
                                    <TextField
                                        label="ราคาทั้งหมด"
                                        size="small"
                                        fullWidth
                                        value={product.product_price}
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        onChange={(e) => handleDataChange(index, "product_price", e.target.value, "product")}
                                    />
                                </Grid>
                                <Grid size={1}>
                                    <IconButton onClick={() => handleRemoveData(index, "product")} color="error">
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
                        {material.map((material, index) => (
                            <Grid container spacing={2} key={index} sx={{
                                mb: 1
                            }}>
                                <Grid size={3}>
                                    <TextField
                                        label="ชื่อวัสดุ"
                                        size="small"
                                        fullWidth
                                        value={material.material_name}
                                        onChange={(e) => handleDataChange(index, "material_name", e.target.value, "material")}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <TextField
                                        label="จำนวน"
                                        size="small"
                                        fullWidth
                                        value={material.material_quantity}
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        onChange={(e) => handleDataChange(index, "material_quantity", e.target.value, "material")}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id={`unit-label-${index}`}>หน่วย</InputLabel>
                                        <Select
                                            labelId={`unit-label-${index}`}
                                            name="unit_id"
                                            value={material.unit_id}
                                            label="หน่วย"
                                            onChange={(e) => handleDataChange(index, "unit_id", e.target.value, "material")}
                                        >
                                            {unit.map((unit) => (
                                                <MenuItem key={unit.id} value={unit.id}>
                                                    {unit.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={2}>
                                    <TextField
                                        label="ราคาทั้งหมด"
                                        size="small"
                                        fullWidth
                                        value={material.material_price}
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        onChange={(e) => handleDataChange(index, "material_price", e.target.value, "material")}
                                    />
                                </Grid>
                                <Grid size={1}>
                                    <IconButton onClick={() => handleRemoveData(index, "material")} color="error">
                                        <DeleteForeverRounded />
                                    </IconButton>
                                </Grid>
                            </Grid>

                        ))}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", marginBottom: 3 }}>
                <Button onClick={handleSubmit} color="success" variant="contained">
                    บันทึก
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddStockIn;
