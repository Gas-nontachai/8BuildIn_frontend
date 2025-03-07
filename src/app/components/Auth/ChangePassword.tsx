import { useState, useEffect } from "react";
import { Close } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, IconButton } from "@mui/material";
import Swal from 'sweetalert2';

import { useAuth, useEmployee } from "@/hooks/hooks"
const { changePassword } = useAuth()
const { getEmployeeByID } = useEmployee()

interface ChangePasswordProps {
    open: boolean;
    onClose: () => void;
    employee_id: string
}

export default function ChangePassword({ open, onClose, employee_id }: ChangePasswordProps) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [errorOld, setErrorOld] = useState("");
    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) {
            setError("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
            return;
        }
        const res = await getEmployeeByID({ employee_id: employee_id })
        if (res.employee_password !== oldPassword) {
            setErrorOld("รหัสผ่านเก่าไม่ถูกต้อง");
            return;
        }
        await changePassword({
            current_password: oldPassword,
            new_password: newPassword,
        })
        Swal.fire({
            icon: "success",
            title: "เปลี่ยนรหัสผ่านสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setErrorOld("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle id="alert-dialog-title">
                เปลี่ยนรหัสผ่าน
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                    sx={{
                        position: 'absolute',
                        right: 20,
                        top: 8,
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="รหัสผ่านเดิม"
                    type="password"
                    fullWidth
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    error={!!errorOld}
                    helperText={errorOld}
                />
                <TextField
                    margin="dense"
                    label="รหัสผ่านใหม่"
                    type="password"
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="ยืนยันรหัสผ่านใหม่"
                    type="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!error}
                    helperText={error}
                />
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={handleSubmit} color="success" variant="contained">ยืนยัน</Button>
            </DialogActions>
        </Dialog>
    );
}
