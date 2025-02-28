import React, { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    IconButton,
    Grid,
    CircularProgress,
} from "@mui/material";
import Swal from 'sweetalert2';

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

    useEffect(() => {
        if (open && supplier_id) {
            fetchData();
        }
    }, [open, supplier_id]);

    const fetchData = async () => {
        try {
            const res = await getSupplierByID({ supplier_id });
            setData(res);
        } catch (error) {
            console.error("Error fetching supplier data:", error);
            Swal.fire("Error", "ไม่สามารถดึงข้อมูลผู้จำหน่ายได้", "error");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) =>
            prev ? { ...prev, [name]: value } : null
        );
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) =>
            prev ? {
                ...prev,
                supplier_contact: {
                    ...prev.supplier_contact,
                    [name]: value
                }
            } : null
        );
    };

    const handleSubmit = async () => {
        if (!data) return;
        setLoading(true);
        try {
            console.log();

            // await updateSupplierBy(data);
            // Swal.fire("สำเร็จ!", "อัปเดตข้อมูลผู้จำหน่ายเรียบร้อยแล้ว", "success");
            // onClose();
        } catch (error) {
            console.error("Error updating supplier:", error);
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                แก้ไขข้อมูลผู้จำหน่าย
                <IconButton onClick={onClose} style={{ position: "absolute", right: 10, top: 10 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {data && (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="ชื่อผู้จำหน่าย"
                                name="supplier_name"
                                fullWidth
                                value={data.supplier_name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="เบอร์โทร"
                                name="phone"
                                fullWidth
                                value={data.supplier_contact.phone}
                                onChange={handleContactChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="อีเมล"
                                name="email"
                                fullWidth
                                value={data.supplier_contact.email}
                                onChange={handleContactChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="ที่อยู่"
                                name="address"
                                fullWidth
                                multiline
                                rows={3}
                                value={data.supplier_contact.address}
                                onChange={handleContactChange}
                            />
                        </Grid>
                    </Grid>
                )}
                <p>ไม่พบข้อมูล</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">ยกเลิก</Button>
                <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "บันทึก"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateSupplier;