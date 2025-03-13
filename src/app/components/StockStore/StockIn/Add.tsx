'use client';

import React, { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    IconButton,
    FormControl,
    Select,
    MenuItem,
    FormLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Loading from "../../Loading";
import Swal from 'sweetalert2';

import { decimalFix } from "@/utils/number-helper"
import { useStockIn, useUnit, usePurchaseOrder, usePurchaseRequest } from "@/hooks/hooks";
import { StockIn } from '@/misc/types';

const { insertStockIn } = useStockIn();
const { getUnitBy } = useUnit();
const { getPurchaseOrderBy, getPurchaseOrderByID } = usePurchaseOrder();
const { getPurchaseRequestByID } = usePurchaseRequest();

interface AddStockInProps {
    onClose: () => void;
    onRefresh: () => void;
    open: boolean;
}

const AddStockIn: React.FC<AddStockInProps> = ({ onClose, open, onRefresh }) => {
    const [formData, setFormData] = useState<StockIn>({
        stock_in_id: '',
        po_id: '',
        product: '',
        material: '',
        stock_in_price: 0,
        stock_in_note: '',
        supplier_id: '',
    });

    const [loading, setLoading] = useState(false);
    const [unit, setUnit] = useState<{ id: string; name: string }[]>([]);
    const [po, setPO] = useState<{ id: string; name: string }[]>([]);
    const [product, setProduct] = useState<{ product_name: string, product_quantity: number, unit_id: string, product_price: number }[]>([]);
    const [material, setMaterial] = useState<{ material_name: string, material_quantity: number, unit_id: string, material_price: number }[]>([]);

    useEffect(() => {
        if (open) {
            fetchUnit()
            fetchPO()
        }
    }, [open]);

    useEffect(() => {
        calculate_price();
    }, [product, material]);

    const fetchUnit = async () => {
        try {
            const { docs: res } = await getUnitBy();
            setUnit(res.map(item => ({ id: item.unit_id, name: `${item.unit_name_th}(${item.unit_name_en})` })))
        } catch (error) {
            console.error("Error fetching supplier data:", error);
            Swal.fire("Error", "ไม่สามารถดึงข้อมูลผู้จำหน่ายได้", "error");
        }
    };

    const fetchPO = async () => {
        try {
            const { docs: res } = await getPurchaseOrderBy({
                match: {
                    po_status: "buying"
                }
            });
            setPO(res.map(item => ({ id: item.po_id, name: item.po_id })))
        } catch (error) {
            console.error("Error fetching PO data:", error);
            Swal.fire("Error", "ไม่สามารถดึงข้อมูลใบสั่งซื้อได้", "error");
        }
    }

    const fetchDataFromPO = async (po_id: string) => {
        try {
            setLoading(true)
            const res = await getPurchaseOrderByID({ po_id });
            setProduct(JSON.parse(res.product || '[]'))
            setMaterial(JSON.parse(res.material || '[]'))
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }

    const calculate_price = () => {
        const totalProductPrice = product.reduce((sum, item) => sum + (Number(item.product_price) || 0), 0);
        const totalMaterialPrice = material.reduce((sum, item) => sum + (Number(item.material_price) || 0), 0);
        const totalPrice = totalProductPrice + totalMaterialPrice;

        setFormData(prev => ({ ...prev, stock_in_price: totalPrice }));
    };

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (e.target.name == "po_id") {
            fetchDataFromPO(e.target.value)
        }
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
            await insertStockIn(insertData);
            setFormData({
                stock_in_id: '',
                po_id: '',
                product: '',
                material: '',
                stock_in_price: 0,
                stock_in_note: '',
                supplier_id: '',
            });
            close();
            onRefresh();
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

    const close = () => {
        setFormData({
            stock_in_id: '',
            po_id: '',
            product: '',
            material: '',
            stock_in_price: 0,
            stock_in_note: '',
            supplier_id: '',
        });
        setMaterial([]);
        setProduct([]);
        onClose()
    }

    return (
        <Dialog open={open} onClose={() => close()} fullWidth maxWidth="md">
            <DialogTitle>
                เพิ่มข้อมูลการนำเข้าสต็อก
                <IconButton onClick={() => close()} style={{ position: "absolute", right: 10, top: 10 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <FormLabel component="legend" className="mb-2">ใบสั่งซื้อ <span className="text-red-500">*</span></FormLabel>
                        <FormControl fullWidth>
                            <Select
                                name="po_id"
                                value={formData.po_id}
                                onChange={handleChange}
                                size="small"
                            >
                                {po.map((p_o) => (
                                    <MenuItem key={p_o.id} value={p_o.id}>
                                        {p_o.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={12}>
                        <p className="text-[15px] font-[400] text-gray-800 mb-2">
                            ราคานำเข้าทั้งหมด&nbsp;
                            <span className="text-blue-500 font-[500]">
                                {decimalFix(formData.stock_in_price || 0)}
                            </span> ฿
                        </p>
                    </Grid>
                    <Grid size={12}>
                        <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>
                            หมายเหตุ (ไม่บังคับ)
                        </FormLabel>
                        <textarea
                            value={formData.stock_in_note}
                            onChange={(e) =>
                                setFormData({ ...formData, stock_in_note: e.target.value })
                            }
                            placeholder="เพิ่มหมายเหตุ..."
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                    </Grid>
                    {loading ? (
                        <Box className="w-full flex justify-center items-center">
                            <Loading />
                        </Box>
                    ) : (
                        <>
                            {product.length > 0 && (
                                <>
                                    <FormLabel component="legend">สินค้า <span className="text-red-500">*</span></FormLabel>
                                    <Grid size={12}>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="product table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>ชื่อสินค้า</TableCell>
                                                        <TableCell>จำนวน</TableCell>
                                                        <TableCell>ราคาทั้งหมด</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {product.map((product, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{product.product_name}</TableCell>
                                                            <TableCell>{product.product_quantity} {unit.find(unit => unit.id === product.unit_id)?.name}</TableCell>
                                                            <TableCell>{product.product_price} ฿</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {/* แถวสรุป */}
                                                    <TableRow>
                                                        <TableCell><strong>รวม</strong></TableCell>
                                                        <TableCell><strong>
                                                            {product.length} ชิ้น
                                                        </strong></TableCell>
                                                        <TableCell>
                                                            <strong>
                                                                {decimalFix(product.reduce((total, item) => total + item.product_price, 0))} ฿
                                                            </strong>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </>
                            )}

                            {material.length > 0 && (
                                <>
                                    <FormLabel component="legend">วัสดุ <span className="text-red-500">*</span></FormLabel>

                                    <Grid size={12}>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="material table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>ชื่อวัสดุ</TableCell>
                                                        <TableCell >จำนวน</TableCell>
                                                        <TableCell >ราคาทั้งหมด</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {material.map((material, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{material.material_name}</TableCell>
                                                            <TableCell >{material.material_quantity} {unit.find(unit => unit.id === material.unit_id)?.name}</TableCell>
                                                            <TableCell >{material.material_price} ฿</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    <TableRow>
                                                        <TableCell><strong>รวม</strong></TableCell>
                                                        <TableCell>
                                                            <strong>
                                                                {material.length} ชิ้น
                                                            </strong></TableCell>
                                                        <TableCell>
                                                            <strong>
                                                                {decimalFix(material.reduce((total, item) => total + item.material_price, 0))} ฿
                                                            </strong>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </>
                            )}
                        </>
                    )}
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
