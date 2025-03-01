import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
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

import useSupplier from "@/hooks/useSupplier";
import { Supplier } from '@/misc/types';

const { getSupplierByID, updateSupplierBy } = useSupplier();

interface UpdateSupplierProps {
    onClose: () => void;
    open: boolean;
    supplier_id: string;
}

const UpdateSupplier: React.FC<UpdateSupplierProps> = ({ onClose, open, supplier_id }) => {
    const [data, setData] = useState<Supplier | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
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

    const handleSubmit = async () => {
        const supplierData: Supplier = {
            supplier_id: supplier_id,
            supplier_name: name,
            supplier_contact: JSON.stringify(contacts),
        };
        await updateSupplierBy(supplierData)
        await onClose();
    };

    useEffect(() => {
        if (open && supplier_id) {
            fetchData();
        }
    }, [open, supplier_id]);

    const fetchData = async () => {
        try {
            const res = await getSupplierByID({ supplier_id });
            setData(res);
            setContacts(JSON.parse(res.supplier_contact))
            setName(res.supplier_name)
        } catch (error) {
            console.error("Error fetching supplier data:", error);
            Swal.fire("Error", "ไม่สามารถดึงข้อมูลผู้จำหน่ายได้", "error");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                แก้ไขข้อมูลผู้จำหน่าย
                <IconButton onClick={onClose} style={{ position: "absolute", right: 10, top: 10 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormLabel component="legend" className="mb-2">ชื่อผู้จำหน่าย <span className="text-red-500">*</span></FormLabel>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Grid>
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
                            เพิ่มช่องติดต่อ
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

export default UpdateSupplier;