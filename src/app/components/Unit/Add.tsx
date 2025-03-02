'use client';

import React, { useEffect, useState } from "react";
import { Close, } from "@mui/icons-material";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Swal from 'sweetalert2';

import useUnit from "@/hooks/useUnit";
import { Unit } from '@/misc/types';

const { insertUnit } = useUnit();

interface AddUnitProps {
    onClose: () => void;
    onRefresh: () => void;
    open: boolean;
}

const AddUnit: React.FC<AddUnitProps> = ({ onClose, open, onRefresh }) => {
    const [formData, setFormData] = useState<Unit>({
        unit_id: "",
        unit_name_th: "",
        unit_name_en: "",
        addby: "",
        adddate: "",
        updateby: "",
        lastupdate: "",
    });

    const handleSubmit = async () => {
        const insertData = {
            ...formData
        };
        try {
            await insertUnit(insertData);
            setFormData({
                unit_id: "",
                unit_name_th: "",
                unit_name_en: "",
                addby: "",
                adddate: "",
                updateby: "",
                lastupdate: "",
            })
            await onClose()
            await onRefresh()
            Swal.fire({
                title: 'Success!',
                text: 'Stock has been successfully added.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            console.error("Error inserting stock:", error);
            Swal.fire({
                title: 'Error!',
                text: 'There was an error while inserting stock.',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }
    };

    useEffect(() => {
        if (open) {
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                เพิ่มข้อมูลหน่วย
                <IconButton onClick={onClose} style={{ position: "absolute", right: 10, top: 10 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <TextField
                            label="หน่วย (th)"
                            size="small"
                            fullWidth
                            type="text"
                            value={formData.unit_name_th}
                            onChange={(e) => setFormData({ ...formData, unit_name_th: e.target.value })}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="หน่วย (en)"
                            size="small"
                            fullWidth
                            type="text"
                            value={formData.unit_name_en}
                            onChange={(e) => setFormData({ ...formData, unit_name_en: e.target.value })}
                        />
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

export default AddUnit;
