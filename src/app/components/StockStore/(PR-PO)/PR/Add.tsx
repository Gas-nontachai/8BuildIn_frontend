'use client';
import React, { useEffect, useRef, useState } from "react";
import { formatDate } from "@/utils/date-helper"
import { Close, DeleteForeverRounded, Add, CloudUpload } from "@mui/icons-material";
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

import { usePurchaseRequest } from "@/hooks/hooks";
import { PurchaseRequest } from '@/misc/types';
import { decimalFix } from "@/utils/number-helper";

const { insertPurchaseRequest } = usePurchaseRequest();

interface Props {
    onRefresh: () => void;
    onClose: () => void;
    open: boolean;
}

const PurchaseRequestAdd: React.FC<Props> = ({ onRefresh, onClose, open }) => {

    const [purchaseRequest, setPurchaseRequest] = useState<PurchaseRequest>({
        pr_id: '',
        product: '',
        material: '',
        pr_states: '',
        pr_note: '',
    })
    const [product, setProduct] = useState<{ product_name: string, product_quantity: number, product_price: number }[]>([]);
    const [material, setMaterial] = useState<{ material_name: string, material_quantity: number, material_price: number }[]>([]);

    const handleAddData = (type: "product" | "material") => {
        if (type === "product") {
            setProduct([...product, { product_name: "", product_quantity: 0, product_price: 0 }]);
        } else {
            setMaterial([...material, { material_name: "", material_quantity: 0, material_price: 0 }]);
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

    const handleRemoveData = (index: number, type: "product" | "material") => {
        if (type === "product") {
            setProduct(product.filter((_, i) => i !== index));
        } else {
            setMaterial(material.filter((_, i) => i !== index));
        }
    }

    const handleSubmit = async () => {
        const insertData = {
            ...purchaseRequest,
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
            await insertPurchaseRequest(insertData);
            setPurchaseRequest({
                pr_id: '',
                product: '',
                material: '',
                pr_states: '',
                pr_note: '',
            });
            setMaterial([]);
            setProduct([]);
            await onRefresh();
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'เปิดใบ PR เรียบร้อย',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            console.error("Error inserting stock:", error);
        };
    }

    const handleClose = async () => {
        setMaterial([]);
        setProduct([]);
        onClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" >
            <DialogTitle>
                สร้าง PR
                <IconButton onClick={handleClose} style={{ position: "absolute", right: 10, top: 10 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Button onClick={() => handleAddData("product")} startIcon={<Add />} color="primary">
                            เพิ่มสินค้า
                        </Button>
                        <Button onClick={() => handleAddData("material")} startIcon={<Add />} color="primary">
                            เพิ่มวัสดุ
                        </Button>
                    </Grid>
                    {product.length > 0 && (
                        <FormLabel component="legend">สินค้า <span className="text-red-500">*</span></FormLabel>
                    )}
                    <Grid size={12}>
                        {product.map((product, index) => (
                            <Grid container spacing={2} key={index} sx={{
                                mb: 1
                            }}>
                                <Grid size={8}>
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
                                <Grid size={1}>
                                    <IconButton onClick={() => handleRemoveData(index, "product")} color="error">
                                        <DeleteForeverRounded />
                                    </IconButton>
                                </Grid>
                            </Grid>

                        ))}
                    </Grid>
                    {material.length > 0 && (
                        <FormLabel component="legend">วัสดุ <span className="text-red-500">*</span></FormLabel>
                    )}
                    <Grid size={12}>
                        {material.map((material, index) => (
                            <Grid container spacing={2} key={index} sx={{
                                mb: 1
                            }}>
                                <Grid size={8}>
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
            <DialogActions sx={{ justifyContent: "center" }}>
                <Button onClick={handleSubmit} color="success" variant="contained">
                    บันทึก
                </Button>
            </DialogActions>
        </Dialog >
    )
}
export default PurchaseRequestAdd