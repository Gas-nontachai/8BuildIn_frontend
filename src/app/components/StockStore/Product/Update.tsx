import React, { useState, useEffect } from "react";
import { Close, DeleteForeverRounded, Add, CloudUpload, Edit, UndoRounded } from "@mui/icons-material";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    IconButton,
    FormLabel,
    Typography,
    Autocomplete,
    Divider
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Swal from 'sweetalert2'; 
import Loading from "../../Loading";

import { decimalFix } from "@/utils/number-helper"
import { API_URL } from "@/utils/config"

import { useProductCategory, useUnit, useMaterial, useProduct } from "@/hooks/hooks";

import { Product, Material } from '@/misc/types';
const { getProductCategoryBy } = useProductCategory();
const { getUnitBy } = useUnit();
const { getMaterialBy } = useMaterial();
const { getProductByID, updateProductBy } = useProduct();

interface UpdateProductProps {
    onClose: () => void;
    onRefresh: () => void;
    open: boolean;
    product_id: string;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({ onClose, open, onRefresh, product_id }) => {
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
    const [loading, setLoading] = useState(false);
    const [option_unit, setOptionUnit] = useState<{ title: string, value: string }[]>([]);
    const [option_material, setOptionMaterial] = useState<Material[]>([]);
    const [material, setMaterial] = useState<{ material_id: string, material_quantity: number, material_price: number }[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<{ title: string, value: string } | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            fetchCategory()
            fetchUnit()
            fetchMaterial()
            fetchProduct()
        }
    }, [open])

    useEffect(() => {
        const calculate_price = () => {
            const totalMaterialPrice = material.reduce((sum, item) => {
                return sum + (Number(item.material_price) * Number(item.material_quantity) || 0);
            }, 0);
            setProduct(prev => ({ ...prev, product_price: Number(totalMaterialPrice) }));
        };
        calculate_price();
    }, [material]);

    const fetchProduct = async () => {
        try {
            setLoading(true)
            const res = await getProductByID({ product_id: product_id });
            console.log("ข้อมูลที่ได้จาก API:", res);
            if (res.material) {
                setMaterial(JSON.parse(res.material));
            }
            if (res.product_img) {
                const imageArray = res.product_img.split(',').filter(img => img);
                setExistingImages(imageArray);
            } else {
                setExistingImages([]);
            }
            setProduct(res);
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    };

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

        const defaultUnit = res.find((item: any) => item.unit_name_th === 'ชิ้น');
        if (defaultUnit) {
            setSelectedUnit({
                title: `${defaultUnit.unit_name_th}(${defaultUnit.unit_name_en})`,
                value: defaultUnit.unit_id
            });
        }
    };

    const fetchMaterial = async () => {
        const { docs: res } = await getMaterialBy()
        setOptionMaterial(res)
    }

    const handleDataChange = (index: number, key: string, value: string) => {
        const updatedMaterialList = [...material];
        const numericValue = value === '' ? 0 : Number(value);

        updatedMaterialList[index] = {
            ...updatedMaterialList[index],
            [key]: key === 'material_quantity' ? numericValue : value
        };

        if (key === 'material_quantity') {
            const selectedMaterial = option_material.find(
                (m) => m.material_id === updatedMaterialList[index].material_id
            );
            if (selectedMaterial) {
                const materialPrice = Number(selectedMaterial.material_price);
                updatedMaterialList[index].material_price = numericValue * materialPrice;
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
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const fileArray = Array.from(selectedFiles);
            setFiles(fileArray);
            const previewArray = fileArray.map(file => URL.createObjectURL(file));
            setPreviewUrls(previewArray);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Product) => {
        const value = e.target.value;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [field]: value === '' ? '' : value,
        }));
    };

    const handleRemoveExistingImage = (indexToRemove: number) => {
        const imageToDelete = existingImages[indexToRemove];
        setDeletedImages(prev => [...prev, imageToDelete]);
        setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleReverseImage = (indexToReverse: number) => {
        const imageToReverse = deletedImages[indexToReverse];
        setExistingImages(prev => [...prev, imageToReverse]);
        setDeletedImages(prev => prev.filter((_, index) => index !== indexToReverse));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            Swal.fire({
                icon: 'info',
                title: 'กำลังเพิ่มข้อมูล...',
                text: 'โปรดรอสักครู่',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            const data = { ...product };
            const cleanedMaterial = material.map(item => ({
                ...item,
                material_price: Number(String(item.material_price)),
                material_quantity: Number(String(item.material_quantity))
            }));

            data.material = JSON.stringify(cleanedMaterial);
            data.product_price = Number(String(data.product_price));
            data.product_quantity = data.product_quantity ? data.product_quantity : '1';

            await updateProductBy({
                product: data,
                product_img: files,
                del_img_arr: deletedImages
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
            });
            setDeletedImages([])
            setFiles([]);
            setExistingImages([]);
            await onClose();
            await onRefresh();

            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'แก้ไขสินค้าสำเร็จแล้ว',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            console.error('Error submitting product:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถแก้ไขสินค้าได้',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        }
    };
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" sx={{ height: '100vh' }} >
            <DialogTitle>
                แก้ไรสินค้า
                <IconButton onClick={onClose} style={{ position: "absolute", right: 10, top: 10 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                {loading ? (
                    <Loading />
                ) : (
                    <Grid container spacing={2}>
                        <Grid size={3}>
                            <FormLabel component="legend">ประเภท <span className="text-red-500">*</span></FormLabel>
                            <Autocomplete
                                disablePortal
                                size="small"
                                options={option_category}
                                getOptionLabel={(option) => option.title}
                                renderInput={(params) => <TextField {...params} />}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                value={option_category.find(option => option.value === product.product_category_id) || null}
                                onChange={(event, newValue) => setProduct((prevProduct) => ({
                                    ...prevProduct,
                                    product_category_id: newValue ? newValue.value : '',
                                }))}
                            />
                        </Grid>
                        <Grid size={3}>
                            <FormLabel component="legend">ชื่อสินค้า <span className="text-red-500">*</span></FormLabel>
                            {
                                product.stock_in_id ? (
                                    <Typography className="mt-3" variant="body1" color="primary">{product.product_name}</Typography>
                                ) : (
                                    <TextField
                                        fullWidth
                                        type="text"
                                        size="small"
                                        value={product.product_name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'product_name')}
                                    />
                                )
                            }
                        </Grid>
                        <Grid size={3}>
                            <FormLabel component="legend">จำนวนสินค้า <span className="text-red-500">*</span></FormLabel>
                            {
                                product.stock_in_id ? (
                                    <Typography className="mt-3" variant="body1" color="primary">{product.product_quantity || ''}</Typography>
                                ) : (
                                    <TextField
                                        fullWidth
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        size="small"
                                        value={product.product_quantity || ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'product_quantity')}
                                    />
                                )
                            }
                        </Grid>
                        <Grid size={3}>
                            <FormLabel component="legend">หน่วย <span className="text-red-500">*</span></FormLabel>
                            {
                                product.stock_in_id ? (
                                    <Typography className="mt-3" variant="body1" color="primary">{selectedUnit?.title || ''}</Typography>
                                ) : (
                                    <Autocomplete
                                        disablePortal
                                        size="small"
                                        options={option_unit}
                                        getOptionLabel={(option) => option.title}
                                        renderInput={(params) => <TextField {...params} />}
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                        value={selectedUnit}
                                        onChange={(event, newValue) => setProduct((prevProduct) => ({
                                            ...prevProduct,
                                            unit_id: newValue ? newValue.value : '',
                                        }))}
                                    />
                                )
                            }
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
                            {
                                !product.stock_in_id && (

                                    <Button onClick={() => handleAddMaterial()} startIcon={<Add />} color="primary">
                                        เพิ่มวัสดุ
                                    </Button>
                                )
                            }
                        </Grid>
                        {material.length > 0 && (
                            <>
                                <FormLabel component="legend">วัสดุ <span className="text-red-500">*</span></FormLabel>
                            </>
                        )}
                        <Grid size={12}>
                            {material.map((mt, index) => (
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
                                            value={mt.material_id ? option_material.find(option => option.material_id === mt.material_id) || null : null}
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
                                            value={mt.material_quantity || 0}
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
                                            value={mt.material_price * (mt.material_quantity || 0)}
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            InputProps={{ readOnly: true }}
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
                                <Grid container spacing={2}>
                                    <Grid size={12} sx={{ mt: 2 }}>
                                        <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>
                                            รูปปัจจุบัน
                                        </FormLabel>
                                        <div className="flex flex-row flex-wrap items-center gap-4 p-2">
                                            {existingImages.map((image, index) => {
                                                return (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={`${API_URL}${image}`}
                                                            alt={`Image ${index + 1}`}
                                                            className="w-24 h-24 object-cover rounded-lg border"
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveExistingImage(index)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid size={12}>
                                    {deletedImages.length > 0 && (
                                        <Grid size={12}>
                                            <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>
                                                รูปภาพที่จะถูกลบ
                                            </FormLabel>
                                            <div className="flex flex-row flex-wrap items-center gap-4 p-2 bg-red-50 rounded-lg">
                                                {deletedImages.map((image, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={`${API_URL}${image}`}
                                                            alt={`Deleted Image ${index + 1}`}
                                                            className="w-24 h-24 object-cover rounded-lg border opacity-50"
                                                        />
                                                        <button
                                                            onClick={() => handleReverseImage(index)}
                                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
                                                            title="คืนค่ารูปภาพ"
                                                        >
                                                            <UndoRounded />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </Grid>
                                    )}
                                </Grid>
                                <div className="grid grid-cols-12">
                                    <div className="relative flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md col-span-12">
                                        <label className="flex flex-col items-center w-full cursor-pointer">
                                            <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 rounded-lg bg-white hover:border-gray-600 transition">
                                                <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v12m0 0l-4-4m4 4l4-4M4 12a8 8 0 0116 0c0 4.418-3.582 8-8 8s-8-3.582-8-8z" />
                                                </svg>
                                                <span className="mt-2 text-sm text-gray-600">คลิกเพื่ออัปโหลดไฟล์</span>
                                            </div>
                                            <input id="file-input" type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                                        </label>
                                        <button className="mt-4 px-6 py-2 text-white bg-gradient-to-r from-[#3b82f6] to-[#0ea5e9] rounded-lg shadow-lg hover:opacity-70 transition">
                                            <CloudUpload className="mr-2" />
                                            อัปโหลดไฟล์
                                        </button>
                                        {files.length > 0 && (
                                            <div className="mt-4 w-full">
                                                <p className="text-sm text-gray-600">ไฟล์ที่เลือก:</p>
                                                <div className="flex flex-row flex-wrap items-center gap-4 p-2  rounded-lg">
                                                    {previewUrls.map((url, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={url}
                                                                alt={`Image ${index + 1}`}
                                                                className="w-24 h-24 object-cover rounded-lg border"
                                                            />
                                                            <button
                                                                onClick={() => handleRemoveExistingImage(index)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </DialogContent >
            <DialogActions sx={{ justifyContent: "center" }}>
                <Button onClick={handleSubmit} color="success" variant="contained">
                    บันทึก
                </Button>
            </DialogActions>
        </Dialog >
    );
};

export default UpdateProduct;