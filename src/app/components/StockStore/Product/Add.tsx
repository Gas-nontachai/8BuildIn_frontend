import React, { useState, useEffect } from "react";
import { Close, DeleteForeverRounded, Add, CloudUpload } from "@mui/icons-material";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    IconButton,
    FormLabel,
    Autocomplete,
    Divider
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Swal from 'sweetalert2';

import { decimalFix } from "@/utils/number-helper"
import { useProductCategory, useUnit, useMaterial, useProduct } from "@/hooks/hooks";

import { Product, Material } from '@/misc/types';
const { getProductCategoryBy } = useProductCategory();
const { getUnitBy } = useUnit();
const { getMaterialBy } = useMaterial();
const { insertProduct } = useProduct();

interface AddProductProps {
    onClose: () => void;
    onRefresh: () => void;
    open: boolean;
}

const AddProduct: React.FC<AddProductProps> = ({ onClose, open, onRefresh }) => {

    const [product, setProduct] = useState<Product>({
        product_id: '',
        product_category_id: '',
        product_name: '',
        product_quantity: '',
        product_price: 0,
        unit_id: '',
        material: '',
        product_img: '',
        stock_in_id: '',
    })
    const [option_category, setOptionCategory] = useState<{ title: string, value: string }[]>([]);
    const [option_unit, setOptionUnit] = useState<{ title: string, value: string }[]>([]);
    const [option_material, setOptionMaterial] = useState<Material[]>([]);
    const [material, setMaterial] = useState<{ material_id: string, material_quantity: number, material_price: number }[]>([]);
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        if (open) {
            fetchCategory()
            fetchUnit()
            fetchMaterial()
        }
    }, [open])

    useEffect(() => {
        const calculate_price = () => {
            const totalMaterialPrice = material.reduce((sum, item) => {
                return sum + (Number(item.material_price) * Number(item.material_quantity) || 0);
            }, 0);
            setProduct(prev => ({ ...prev, product_price: decimalFix(totalMaterialPrice) }));
        };
        calculate_price();
    }, [material]);

    const fetchCategory = async () => {
        const { docs: res } = await getProductCategoryBy()
        setOptionCategory(res.map((item: any) => ({ title: item.product_category_name, value: item.product_category_id })))
    }

    const fetchUnit = async () => {
        const { docs: res } = await getUnitBy();
        setOptionUnit(res.map((item: any) => ({
            title: `${item.unit_name_th}(${item.unit_name_en})`,
            value: item.unit_id
        })));
    };

    const fetchMaterial = async () => {
        const { docs: res } = await getMaterialBy()
        setOptionMaterial(res)
    }

    const handleDataChange = (index: number, key: string, value: string) => {
        const updatedMaterialList = [...material];
        updatedMaterialList[index] = { ...updatedMaterialList[index], [key]: value };

        if (key === 'material_quantity') {
            const selectedMaterial = option_material.find(
                (m) => m.material_id === updatedMaterialList[index].material_id
            );
            if (selectedMaterial) {
                updatedMaterialList[index].material_price = (
                    parseFloat(value) * parseFloat(selectedMaterial.material_price)
                );
            }
        }
        setMaterial(updatedMaterialList);
    };

    const handleAddMaterial = () => {
        setMaterial([
            ...material,
            { material_id: "", material_quantity: 0, material_price: 0 },
        ]);
    };

    const handleRemoveMaterial = (index: number) => {
        setMaterial(material.filter((_, i) => i !== index));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    const handleUploadClick = () => {
        document.getElementById("file-input")?.click();
    };

    const handleRemoveFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleInputChange = (e: any, field: keyof Product) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            [field]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        const data = { ...product }
        data.material = JSON.stringify(material)
        data.product_quantity = data.product_quantity ? data.product_quantity : '1'
        data.product_price = Number(data.product_price)
        try {
            Swal.fire({
                icon: 'info',
                title: 'กำลังเพิ่มข้อมูล...',
                text: 'โปรดรอสักครู่ขณะกำลังยืนยันตัวตน',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            await insertProduct({
                product: data,
                product_img: files,
            });
            setProduct({
                product_id: '',
                product_category_id: '',
                product_name: '',
                product_quantity: '',
                product_price: 0,
                unit_id: '',
                material: '',
                product_img: '',
                stock_in_id: '',
            })
            setFiles([])
            await onClose()
            await onRefresh()
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'เพิ่มสินค้าสำเร็จแล้ว',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" sx={{ height: '100vh' }} >
            <DialogTitle>
                เพิ่มสินค้า
                <IconButton onClick={onClose} style={{ position: "absolute", right: 10, top: 10 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    <Grid size={3}>
                        <FormLabel component="legend" className="mb-2">ประเภทสินค้า <span className="text-red-500">*</span></FormLabel>
                        <Autocomplete
                            disablePortal
                            size="small"
                            options={option_category}
                            getOptionLabel={(option) => option.title}
                            renderInput={(params) => <TextField {...params} placeholder="ประเภท" />}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            onChange={(event, newValue) => setProduct((prevProduct) => ({
                                ...prevProduct,
                                product_category_id: newValue ? newValue.value : '',
                            }))}
                        />
                    </Grid>
                    <Grid size={3}>
                        <FormLabel component="legend" className="mb-2">ชื่อสินค้า <span className="text-red-500">*</span></FormLabel>
                        <TextField
                            fullWidth
                            placeholder="ชื่อสินค้า"
                            size="small"
                            type="text"
                            value={product.product_name}
                            onChange={(e) => handleInputChange(e, 'product_name')}
                        />
                    </Grid>
                    <Grid size={3}>
                        <FormLabel component="legend" className="mb-2">หน่วย <span className="text-red-500">*</span></FormLabel>
                        <Autocomplete
                            disablePortal
                            size="small"
                            options={option_unit}
                            getOptionLabel={(option) => option.title}
                            renderInput={(params) => <TextField {...params} placeholder="หน่วย" />}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            onChange={(event, newValue) => setProduct((prevProduct) => ({
                                ...prevProduct,
                                unit_id: newValue ? newValue.value : '',
                            }))}
                        />
                    </Grid>
                    <Grid size={3}>
                        <FormLabel component="legend" className="mb-2">จำนวนสินค้า <span className="text-red-500">*</span></FormLabel>
                        <TextField
                            fullWidth
                            placeholder="จำนวนสินค้า"
                            size="small"
                            type="number"
                            inputProps={{ min: 0 }}
                            value={product.product_quantity}
                            onChange={(e) => handleInputChange(e, 'product_quantity')}
                        />
                    </Grid>
                    <Grid size={12}>
                        <p className="text-[15px] font-[400] text-gray-800 mb-2">
                            ราคาต้นทุนสินค้า&nbsp;
                            <span className="text-blue-500 font-[500]">
                                {decimalFix(product.product_price || 0)}
                            </span> ฿
                        </p>
                    </Grid>
                    <Grid size={12}>
                        <Divider />
                    </Grid>
                    <Grid size={12}>
                        <Button onClick={() => handleAddMaterial()} startIcon={<Add />} color="primary">
                            เพิ่มวัสดุ
                        </Button>
                    </Grid>
                    {material.length > 0 && (
                        <>
                            <FormLabel component="legend">วัสดุ <span className="text-red-500">*</span></FormLabel>
                        </>
                    )}
                    <Grid size={12}>
                        {material.map((contact, index) => (
                            <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                                <Grid size={5}>
                                    <Autocomplete
                                        key={option_material[index]?.material_id || index}
                                        disablePortal
                                        size="small"
                                        options={option_material.filter(option => !material.some(m => m.material_id === option.material_id))}
                                        getOptionLabel={(option) => `${option.material_name} (${option.material_id})`}
                                        renderInput={(params) => <TextField {...params} label="วัสดุ" />}
                                        isOptionEqualToValue={(option, value) => option.material_id === value.material_id}
                                        onChange={(e, newValue) => {
                                            if (newValue) {
                                                handleDataChange(index, 'material_id', newValue.material_id);
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <TextField
                                        label="จำนวน"
                                        size="small"
                                        fullWidth
                                        value={contact.material_quantity}
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        onChange={(e) => handleDataChange(index, 'material_quantity', e.target.value)}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <TextField
                                        label="ราคาทั้งหมด"
                                        size="small"
                                        fullWidth
                                        value={decimalFix(contact.material_price * contact.material_quantity)}
                                        type="number"
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>
                                <Grid size={1}>
                                    <IconButton onClick={() => handleRemoveMaterial(index)} color="error">
                                        <DeleteForeverRounded />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Grid size={12}>
                            <div className="grid grid-cols-12">
                                <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md col-span-12">
                                    <label className="flex flex-col items-center w-full cursor-pointer">
                                        <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 rounded-lg bg-white hover:border-gray-600 transition">
                                            <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v12m0 0l-4-4m4 4l4-4M4 12a8 8 0 0116 0c0 4.418-3.582 8-8 8s-8-3.582-8-8z" />
                                            </svg>
                                            <span className="mt-2 text-sm text-gray-600">คลิกเพื่ออัปโหลดไฟล์</span>
                                        </div>
                                        <input id="file-input" type="file" className="hidden" multiple onChange={handleFileChange} />
                                    </label>
                                    <button className="mt-4 px-6 py-2 text-white bg-gradient-to-r from-[#3b82f6] to-[#0ea5e9] rounded-lg shadow-lg hover:opacity-70 transition" onClick={handleUploadClick}>
                                        <CloudUpload className="mr-2" />
                                        อัปโหลดไฟล์
                                    </button>
                                    {files.length > 0 && (
                                        <div className="mt-4 text-sm text-gray-600 w-full">
                                            <p>ไฟล์ที่เลือก:</p>
                                            <ul className="mt-2">
                                                {files.map((file, index) => (
                                                    <li key={index} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                                                        <span>{file.name}</span>
                                                        <button onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700">
                                                            ลบ
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                <Button onClick={handleSubmit} color="success" variant="contained">
                    บันทึก
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProduct;