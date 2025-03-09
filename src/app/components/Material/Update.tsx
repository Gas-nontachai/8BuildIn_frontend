'use client';

import React, { useEffect, useRef, useState } from "react";
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

import { useMaterial, useMaterialCategory } from "@/hooks/hooks";
import { Material } from '@/misc/types';

const { getMaterialByID, updateMaterialBy } = useMaterial();
const { getMaterialCategoryBy } = useMaterialCategory();

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
    const [file, setFile] = useState<File>();

    useEffect(() => {
        if (material_id) {
            fetchData();
        }
    }, [material_id]);

    const fetchData = async () => {
        setLoading(true);
        const data = await getMaterialByID({ material_id: material_id });
        setMaterial(data);
        setLoading(false);
    }

    const handleSubmit = () => {
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
                <Grid container spacing={2}>
                    <Grid size={12}  >
                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <FormControl fullWidth>
                                    <Select
                                        value={contact.type}
                                        onChange={(e) => handleTypeChange(index, e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>ประเภทวัสดุ</MenuItem>
                                        {option_contact.map((option) => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    label="ชื่อวัสดุ"
                                    fullWidth
                                    value={contact.value}
                                    onChange={(e) => handleContactChange(index, e.target.value)}
                                />
                            </Grid>
                            <Grid size={4}>
                                <TextField
                                    label="ราคา"
                                    fullWidth
                                    value={contact.value}
                                    onChange={(e) => handleContactChange(index, e.target.value)}
                                />
                            </Grid>
                            <Grid size={2} >
                                <TextField
                                    label="บาท"
                                    fullWidth
                                    value={contact.value}
                                    disabled
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={4}>
                                <TextField
                                    label="จำนวน"
                                    fullWidth
                                    value={contact.value}
                                    onChange={(e) => handleContactChange(index, e.target.value)}
                                />
                            </Grid>
                            <Grid size={2}>
                                <FormControl fullWidth>
                                    <Select
                                        value={contact.type}
                                        onChange={(e) => handleTypeChange(index, e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>หน่วย</MenuItem>
                                        {option_contact.map((option) => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={12}>
                                <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md">
                                    <label className="flex flex-col items-center w-full cursor-pointer">
                                        <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 rounded-lg bg-white hover:border-gray-600 transition">
                                            <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v12m0 0l-4-4m4 4l4-4M4 12a8 8 0 0116 0c0 4.418-3.582 8-8 8s-8-3.582-8-8z" />
                                            </svg>
                                            <span className="mt-2 text-sm text-gray-600">คลิกเพื่ออัปโหลดไฟล์</span>
                                        </div>
                                        <input type="file" className="hidden" />
                                    </label>
                                    <button className="mt-4 px-6 py-2 text-white bg-gradient-to-r from-blue-500 to-orange-600 rounded-lg shadow-lg hover:opacity-90 transition">
                                        {<CloudUpload className="mr-2" />}
                                        อัปโหลดไฟล์
                                    </button>
                                </div>
                            </Grid>
                            <Grid size={12}>
                                <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md">
                                    <label className="flex flex-row items-center w-full cursor-pointer">
                                        <Grid size={6}>
                                            <label>เพิ่มข้อมูลโดย :</label>
                                            <label>นายเทพระเบิด</label>
                                        </Grid>
                                        <Grid size={6}>
                                            <label>แก้ไขข้อมูลโดย :</label>
                                            <label>นายเทพระเบิด</label>
                                        </Grid>
                                    </label>
                                    <label className="flex flex-row items-center w-full cursor-pointer">
                                        <Grid size={6}>
                                            <label>วันที่เพิ่ม :</label>
                                            <label> 01/03/2568 18:28</label>
                                        </Grid>
                                        <Grid size={6}>
                                            <label>วันที่แก้ไข :</label>
                                            <label> 01/03/2568 18:28</label>
                                        </Grid>
                                    </label>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
                <Button /* onClick={handleSubmit} */ color="success" variant="contained">
                    บันทึก
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateMaterial;