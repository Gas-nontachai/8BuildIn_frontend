'use client';

import React, { useRef, useState } from "react";
import { Close, DeleteForeverRounded, Add, CloudUpload } from "@mui/icons-material";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    IconButton,
    Grid,
    FormControl,
    Select,
    MenuItem,
    FormLabel
} from "@mui/material";
import Swal from 'sweetalert2';

// import useMaterial from "@/hooks/useMaterial";
import { Material } from '@/misc/types';

// const { getMaterialByID, updateMaterialBy } = useMaterial();

interface AddMaterialProps {
    onClose: () => void;
    open: boolean;
}

const AddMaterial: React.FC<AddMaterialProps> = ({ onClose, open }) => {


    const [material, setMaterial] = useState()
    // =====================
    const [name, setName] = useState<string>("");
    const [contacts, setContacts] = useState<{ type: string, value: string }[]>([]);

    const option_contact = ['ไม้', 'เหล็ก', 'ระเบิด'];

    const handleContactChange = (index: number, value: string) => {
        const updatedContacts = [...contacts];
        updatedContacts[index].value = value;
        setContacts(updatedContacts);
    };

    const handleTypeChange = (index: number, type: string) => {
        const updatedContacts = [...contacts];
        updatedContacts[index].type = type;
        setContacts(updatedContacts);
    };

    const handleAddContact = () => {
        setContacts([...contacts, { type: "", value: "" }]);
    };

    const handleRemoveContact = (index: number) => {
        const updatedContacts = contacts.filter((_, i) => i !== index);
        setContacts(updatedContacts);
    };

    const handleSubmit = () => {
        // const materialData: Material = {
        //     material_id: "",
        //     material_name: name,
        //     material_contact: JSON.stringify(contacts),
        // };

        // console.log("Material Data:", materialData);
        // console.log("Material Data Contact parsse:", JSON.parse(materialData.material_contact));
        // onClose();
    };
    const [file, setFile] = useState<File>();
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                เพิ่มวัสดุ
                <IconButton onClick={onClose} style={{ position: "absolute", right: 10, top: 10 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    {contacts.map((contact, index) => (
                        <Grid item xs={12} key={index}>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
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
                                <Grid item md={6}>
                                    <TextField
                                        label="ชื่อวัสดุ"
                                        fullWidth
                                        value={contact.value}
                                        onChange={(e) => handleContactChange(index, e.target.value)}
                                    />
                                </Grid>
                                <Grid item md={4}>
                                    <TextField
                                        label="ราคา"
                                        fullWidth
                                        value={contact.value}
                                        onChange={(e) => handleContactChange(index, e.target.value)}
                                    />
                                </Grid>
                                <Grid item md={2} >
                                    <TextField
                                        label="บาท"
                                        fullWidth
                                        value={contact.value}
                                        disabled
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={4}>
                                    <TextField
                                        label="จำนวน"
                                        fullWidth
                                        value={contact.value}
                                        onChange={(e) => handleContactChange(index, e.target.value)}
                                    />
                                </Grid>
                                <Grid item md={2}>
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
                                <Grid item md={12}>
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
                                <Grid item xs={1}>
                                    <IconButton onClick={() => handleRemoveContact(index)} color="error">
                                        <DeleteForeverRounded />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}

                    <Grid item xs={12}>
                        <Button onClick={handleAddContact} startIcon={<Add />} color="primary">
                            เพิ่มข้อมูลวัสดุ
                        </Button>
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

export default AddMaterial;