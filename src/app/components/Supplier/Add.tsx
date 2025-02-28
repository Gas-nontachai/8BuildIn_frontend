import React, { useState } from "react";
import { Close, Delete, Add } from "@mui/icons-material";
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
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import Swal from 'sweetalert2';

import useSupplier from "@/hooks/useSupplier";
import { Supplier } from '@/misc/types';

const { getSupplierByID, updateSupplierBy } = useSupplier();

interface AddSupplierProps {
    onClose: () => void;
    open: boolean;
}

const AddSupplier: React.FC<AddSupplierProps> = ({ onClose, open }) => {
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
        const supplierData: Supplier = {
            supplier_id: "",
            supplier_name: name,
            supplier_contact: JSON.stringify(contacts),
        };

        console.log("Supplier Data:", supplierData); // ตรวจสอบค่าก่อนส่งออก
        console.log("Supplier Data Contact parsse:", JSON.parse(supplierData.supplier_contact)); // ตรวจสอบค่าก่อนส่งออก
        onClose();
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Supplier Name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Grid>

                    {contacts.map((contact, index) => (
                        <Grid container spacing={2} key={index} alignItems="center">
                            <Grid item xs={5}>
                                <FormControl fullWidth>
                                    <InputLabel>ประเภทการติดต่อ</InputLabel>
                                    <Select
                                        value={contact.type}
                                        onChange={(e) => handleTypeChange(index, e.target.value)}
                                    >
                                        {option_contact.map((option) => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    label="ข้อมูลติดต่อ"
                                    fullWidth
                                    value={contact.value}
                                    onChange={(e) => handleContactChange(index, e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton onClick={() => handleRemoveContact(index)} color="secondary">
                                    <Delete />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}

                    <Grid item xs={12}>
                        <Button onClick={handleAddContact} startIcon={<Add />} color="primary">เพิ่มช่องติดต่อ</Button>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Save Supplier</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddSupplier;