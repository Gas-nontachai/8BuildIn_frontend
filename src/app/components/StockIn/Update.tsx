'use client';

import React, { useEffect, useState } from "react";
import { Close, Add, DeleteForeverRounded, UndoRounded } from "@mui/icons-material";
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
    InputLabel
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import Swal from 'sweetalert2';

import { useSupplier, useStockIn, useUnit } from "@/hooks/hooks";
import { StockIn } from '@/misc/types';
import Loading from "../Loading";

const { getSupplierBy } = useSupplier();
const { getStockInByID, updateStockInBy } = useStockIn();
const { getUnitBy } = useUnit();

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
    });

    const [loading, setLoading] = useState(false)
    const [note, setNote] = useState('');
    const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
    const [unit, setUnit] = useState<{ id: string; name: string }[]>([]);
    const [product, setProduct] = useState<{ product_id: string, product_name: string, product_quantity: number, unit_id: string, product_price: number }[]>([]);
    const [material, setMaterial] = useState<{ material_id: string, material_name: string, material_quantity: number, unit_id: string, material_price: number }[]>([]);
    const [del_product, setDelProduct] = useState<{ product_id: string, product_name: string, product_quantity: number, unit_id: string, product_price: number }[]>([]);
    const [del_material, setDelMaterial] = useState<{ material_id: string, material_name: string, material_quantity: number, unit_id: string, material_price: number }[]>([]);

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

        const del_pd_arr = del_product.map(item => item.product_id)
        const del_mt_arr = del_material.map(item => item.material_id)

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
            await updateStockInBy(insertData, del_pd_arr, del_mt_arr);
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
            setDelProduct([]);
            setDelMaterial([]);
            onRefresh();
            Swal.fire({
                title: 'สำเร็จ!',
                text: 'อับเดตสินค้าเข้าสต็อกเรียบร้อยแล้ว',
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

    const handleAddData = (type: "product" | "material") => {
        if (type === "product") {
            setProduct([...product, { product_id: "", product_name: "", product_quantity: 0, unit_id: '', product_price: 0 }]);
        } else {
            setMaterial([...material, { material_id: "", material_name: "", material_quantity: 0, unit_id: '', material_price: 0 }]);
        }
    };

    const handleRemoveData = (index: number, type: "product" | "material") => {
        if (type === "product") {
            setDelProduct([...del_product, product[index]]);
            setProduct(product.filter((_, i) => i !== index));
        } else {
            setDelMaterial([...del_material, material[index]]);
            setMaterial(material.filter((_, i) => i !== index));
        }
    };

    const handleReverseData = (index: number, type: "product" | "material") => {
        if (type === "product") {
            setProduct([...product, del_product[index]]);
            setDelProduct(del_product.filter((_, i) => i !== index));
        } else {
            setMaterial([...material, del_material[index]]);
            setDelMaterial(del_material.filter((_, i) => i !== index));
        }
    };

    useEffect(() => {
        if (open) {
            fetchSupplier();
            fetchData();
            fetchUnit()
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
            setNote(res.stock_in_note)
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
                            <FormLabel component="legend" className="mb-2">ราคานำเข้าทั้งหมด <span className="text-red-500">*</span></FormLabel>
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
                                value={note || ''}
                                onChange={(e) =>
                                    setNote(e.target.value)
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
                                            onChange={(e) => handleDataChange(index, "product_quantity", e.target.value, "product")}
                                        />
                                    </Grid>
                                    <Grid size={2}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>หน่วย</InputLabel>
                                            <Select
                                                name="unit_id"
                                                value={product.unit_id}
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
                                    <Grid size={3}>
                                        <TextField
                                            label="ราคาทั้งหมด"
                                            size="small"
                                            fullWidth
                                            value={product.product_price}
                                            type="number"
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
                        {/* แสดงสินค้าที่กำลังจะถูกลบ */}
                        {del_product.length > 0 && (
                            <>
                                <FormLabel component="legend" className="text-red-500">สินค้า (รอลบ)</FormLabel>
                                <Grid size={12}>
                                    {del_product.map((product, index) => (
                                        <Grid container spacing={2} key={index} sx={{ mb: 1, backgroundColor: "#FFECEC", padding: "8px", borderRadius: "8px", alignItems: "center" }}>
                                            <Grid size={3}>
                                                <TextField label="ชื่อสินค้า" size="small" fullWidth value={product.product_name} disabled />
                                            </Grid>
                                            <Grid size={3}>
                                                <TextField label="จำนวน" size="small" fullWidth value={product.product_quantity} type="number" disabled />
                                            </Grid>
                                            <Grid size={2}>
                                                <TextField label="หน่วย" size="small" fullWidth value={unit.find(u => u.id === product.unit_id)?.name || "-"} disabled />
                                            </Grid>
                                            <Grid size={3}>
                                                <TextField label="ราคาทั้งหมด" size="small" fullWidth value={product.product_price} type="number" disabled />
                                            </Grid>
                                            <Grid size={1}>
                                                <IconButton onClick={() => handleReverseData(index, "product")} color="primary">
                                                    <UndoRounded />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        )}

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
                                            onChange={(e) => handleDataChange(index, "material_quantity", e.target.value, "material")}
                                        />
                                    </Grid>
                                    <Grid size={2}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>หน่วย</InputLabel>
                                            <Select
                                                name="unit_id"
                                                value={material.unit_id}
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
                                    <Grid size={3}>
                                        <TextField
                                            label="ราคาทั้งหมด"
                                            size="small"
                                            fullWidth
                                            value={material.material_price}
                                            type="number"
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
                        {/* แสดงวัสดุที่กำลังจะถูกลบ */}
                        {del_material.length > 0 && (
                            <>
                                <FormLabel component="legend" className="text-red-500">วัสดุ (รอลบ)</FormLabel>
                                <Grid size={12}>
                                    {del_material.map((material, index) => (
                                        <Grid container spacing={2} key={index} sx={{ mb: 1, backgroundColor: "#FFECEC", padding: "8px", borderRadius: "8px", alignItems: "center" }}>
                                            <Grid size={3}>
                                                <TextField label="ชื่อวัสดุ" size="small" fullWidth value={material.material_name} disabled />
                                            </Grid>
                                            <Grid size={3}>
                                                <TextField label="จำนวน" size="small" fullWidth value={material.material_quantity} type="number" disabled />
                                            </Grid>
                                            <Grid size={2}>
                                                <TextField label="หน่วย" size="small" fullWidth value={unit.find(u => u.id === material.unit_id)?.name || "-"} disabled />
                                            </Grid>
                                            <Grid size={3}>
                                                <TextField label="ราคาทั้งหมด" size="small" fullWidth value={material.material_price} type="number" disabled />
                                            </Grid>
                                            <Grid size={1}>
                                                <IconButton onClick={() => handleReverseData(index, "material")} color="primary">
                                                    <UndoRounded />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        )}
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
