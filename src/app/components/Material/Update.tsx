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
    FormLabel
} from "@mui/material";

import Grid from "@mui/material/Grid2";
import Swal from 'sweetalert2';

import Loading from "../Loading";

import { useMaterial, useMaterialCategory, useEmployee, useUnit } from "@/hooks/hooks";
import { Material, MaterialCategory, Employee, Unit } from '@/misc/types';

const { getMaterialByID, updateMaterialBy } = useMaterial();
const { getMaterialCategoryBy } = useMaterialCategory();
const { getEmployeeBy } = useEmployee();
const { getUnitBy } = useUnit();

interface UpdateMaterialProps {
    onRefresh: () => void;
    onClose: () => void;
    open: boolean;
    material_id: string;
}

const UpdateMaterial: React.FC<UpdateMaterialProps> = ({ onRefresh, onClose, open, material_id }) => {
    const [loading, setLoading] = useState(false);
    const [material, setMaterial] = useState<Material>({
        material_id: '',
        material_category_id: '',
        material_name: '',
        material_quantity: '',
        material_price: '',
        unit_id: '',
        material_img: '',
        stock_in_id: ''
    })
    const [materialCategory, setMaterialCategory] = useState<MaterialCategory[]>([]);
    const [unit, setUnit] = useState<Unit[]>([]);
    const [employee, setEmployee] = useState<Employee[]>([]);
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        if (material_id) {
            fetchData();
        }
    }, [material_id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getMaterialByID({ material_id: material_id });
            const employee_id = res.addby
            const { docs: employee_name } = await getEmployeeBy({
                employee_id: employee_id
            })
            const { docs: materialCategory } = await getMaterialCategoryBy();
            const { docs: unit } = await getUnitBy()

            setEmployee(employee_name)
            setMaterial(res);
            setMaterialCategory(materialCategory)
            setUnit(unit)
        } catch (error) {
            console.log(error);

        }
        setLoading(false);
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setMaterial((prevMaterial) => ({
            ...prevMaterial,
            [name]: value,
        }));
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

    const handleSubmit = async () => {
        try {
            await updateMaterialBy({ material: material, material_img: files });
            Swal.fire({
                icon: 'success',
                title: 'แก้ไขข้อมูลสำเร็จ',
                showConfirmButton: false,
                timer: 1500
            });
            onRefresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const getEmployeeName = (id: any) => {
        const emp = employee.find(e => e.employee_id === id);
        return emp ? `${emp.employee_firstname} ${emp.employee_lastname}` : "-";
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                แก้ไขวัสดุ
                <IconButton onClick={onClose} style={{ position: "absolute", right: 10, top: 10 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                {loading ? (
                    <Loading />
                ) : (
                    <Grid container spacing={2}>
                        <Grid size={12} key={material.material_id}>
                            <Grid container spacing={2}>
                                <Grid size={4}>
                                    <FormLabel component="legend" className="mb-2">ประเภทวัสดุ <span className="text-red-500">*</span></FormLabel>
                                    <FormControl fullWidth>
                                        <Select
                                            value={material.material_category_id || "ไม่มีประเภทวัสดุ"}
                                            size="small"
                                            name="material_category_id"
                                            onChange={handleChange}
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>ประเภทวัสดุ</MenuItem>
                                            {materialCategory.map((item) => (
                                                <MenuItem key={item.material_category_id} value={item.material_category_id}>{item.material_category_name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={4}>
                                    <FormLabel component="legend" className="mb-2">ชื่อวัสดุ <span className="text-red-500">*</span></FormLabel>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={material.material_name}
                                        name="material_name"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormLabel component="legend" className="mb-2">หน่วย <span className="text-red-500">*</span></FormLabel>
                                    <FormControl fullWidth>
                                        <Select
                                            value={material.unit_id || "ไม่มีหน่วย"}
                                            name="unit_id"
                                            onChange={handleChange}
                                            displayEmpty
                                            size="small"
                                        >
                                            <MenuItem value="" disabled>ประเภทวัสดุ</MenuItem>
                                            {unit.map((item) => (
                                                <MenuItem key={item.unit_id} value={item.unit_id}>{item.unit_name_th}({item.unit_name_en})</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={6}>
                                    <FormLabel component="legend" className="mb-2">ราคารวมทั้งหมด <span className="text-red-500">*</span></FormLabel>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        type="number"
                                        value={material.material_price}
                                        name="material_price"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormLabel component="legend" className="mb-2">จำนวน <span className="text-red-500">*</span></FormLabel>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        type="number"
                                        value={material.material_quantity}
                                        name="material_quantity"
                                        onChange={handleChange}
                                    />
                                </Grid>
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
                                            <button className="mt-4 px-6 py-2 text-white bg-gradient-to-r from-blue-500 to-orange-600 rounded-lg shadow-lg hover:opacity-90 transition" onClick={handleUploadClick}>
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
                                                                    <DeleteForeverRounded />
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Grid>
                                <Grid size={12} className="w-full">
                                    <div className="flex flex-col items-start p-6 bg-white rounded-2xl shadow-lg gap-4 border border-gray-200">
                                        <div className="w-full mb-4 border-b border-gray-300 pb-2">
                                            <h2 className="text-xl font-semibold text-gray-700">ข้อมูลการเพิ่มและแก้ไข</h2>
                                        </div>
                                        <div className="w-full grid grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-500">เพิ่มข้อมูลโดย</span>
                                                <span className="text-base text-gray-800">{getEmployeeName(material.addby)}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-500">แก้ไขข้อมูลโดย</span>
                                                <span className="text-base text-gray-800">{getEmployeeName(material.updateby)}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-500">วันที่เพิ่ม</span>
                                                <span className="text-base text-gray-800">{formatDate(material.adddate, 'dd/MM/yyyy HH:mm:ss')}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-500">วันที่แก้ไขล่าสุด</span>
                                                <span className="text-base text-gray-800">{formatDate(material.lastupdate, 'dd/MM/yyyy HH:mm:ss')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
                <Button onClick={handleSubmit} color="success" variant="contained">
                    บันทึก
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateMaterial;