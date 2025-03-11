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
    FormLabel
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Swal from 'sweetalert2';

import Loading from "../Loading";

import useUnit from "@/hooks/useUnit";
import { Unit } from '@/misc/types';

const { updateUnitBy, getUnitByID } = useUnit();

interface UpdateUnitProps {
    onClose: () => void;
    onRefresh: () => void;
    open: boolean;
    unit_id: string;
}

const UpdateUnit: React.FC<UpdateUnitProps> = ({ onClose, open, onRefresh, unit_id }) => {
    const [formData, setFormData] = useState<Unit>({
        unit_id: "",
        unit_name_th: "",
        unit_name_en: "",
        addby: "",
        adddate: "",
        updateby: "",
        lastupdate: "",
    });
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        const insertData = {
            ...formData
        };
        try {
            await onClose();
            Swal.fire({
                icon: 'info',
                title: 'กำลังดำเนินการ...',
                text: 'กรุณารอสักครู่',
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            await updateUnitBy(insertData);
            setFormData({
                unit_id: "",
                unit_name_th: "",
                unit_name_en: "",
                addby: "",
                adddate: "",
                updateby: "",
                lastupdate: "",
            });
            await onRefresh();
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'ข้อมูลถูกอัปเดตเรียบร้อยแล้ว',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
            });
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล:", error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถอัปเดตข้อมูลได้',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    useEffect(() => {
        if (open) {
            fetchData()
        }
    }, [open]);

    const fetchData = async () => {
        setLoading(true)
        const res = await getUnitByID({ unit_id })
        setFormData(res)
        setLoading(false)
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                เพิ่มข้อมูลหน่วย
                <IconButton onClick={onClose} style={{ position: "absolute", right: 10, top: 10 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                {loading ? (
                    <Loading />
                ) : (
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <FormLabel component="legend" className="mb-2">หน่วย (th) <span className="text-red-500">*</span></FormLabel>
                            <TextField
                                size="small"
                                label="หน่วย (th)"
                                fullWidth
                                type="text"
                                value={formData.unit_name_th}
                                onChange={(e) => setFormData({ ...formData, unit_name_th: e.target.value })}
                            />
                        </Grid>
                        <Grid size={6}>
                            <FormLabel component="legend" className="mb-2">หน่วย (en) <span className="text-red-500">*</span></FormLabel>
                            <TextField
                                size="small"
                                label="หน่วย (en)"
                                fullWidth
                                type="text"
                                value={formData.unit_name_en}
                                onChange={(e) => setFormData({ ...formData, unit_name_en: e.target.value })}
                            />
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

export default UpdateUnit;
