import React, { useState } from "react";
import { Close, DeleteForeverRounded, Add } from "@mui/icons-material";
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

    const option_contact = ['โทรศัพท์', 'อีเมล', 'ที่อยู่'];

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


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                เพิ่มสินค้า
                <IconButton onClick={onClose} style={{ position: "absolute", right: 10, top: 10 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    {/* <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="รหัสนำเข้า"
                            variant="outlined"
                            value={material.stock_in_id}
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="ชื่อสินค้า"
                            variant="outlined"
                            value={material.material_name}
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="จำนวนสินค้า"
                            variant="outlined"
                            value={material.material_quantity}
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="หน่วยสินค้า"
                            variant="outlined"
                            value={material.unit_id}
                            required
                        />
                    </Grid> */}
                    {contacts.map((contact, index) => (
                        <Grid item xs={12} key={index}>
                            <Grid container spacing={2}>
                                <Grid item xs={5}>
                                    <FormControl fullWidth>
                                        <Select
                                            value={contact.type}
                                            onChange={(e) => handleTypeChange(index, e.target.value)}
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>ประเภทการติดต่อ</MenuItem>
                                            {option_contact.map((option) => (
                                                <MenuItem key={option} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="ข้อมูลติดต่อ"
                                        fullWidth
                                        value={contact.value}
                                        onChange={(e) => handleContactChange(index, e.target.value)}
                                    />
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