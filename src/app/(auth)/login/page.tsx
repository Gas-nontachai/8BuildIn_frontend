"use client";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

import { TextField, Typography, InputAdornment, Checkbox, FormControlLabel } from "@mui/material";
import { Lock, Person } from '@mui/icons-material';

import { AuthProvider } from '@/context/AuthContext';

import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { Employee } from '@/misc/types';

const { authLogin } = useAuth();

const Login = () => {
    const { accessProfile, fetchUserProfile } = AuthProvider();
    const router = useRouter();

    const [formdata, setFormData] = useState<Employee>({
        employee_id: "",
        employee_username: "",
        employee_password: "",
        employee_prefix: "",
        employee_firstname: "",
        employee_lastname: "",
        employee_email: "",
        employee_phone: "",
        employee_birthday: "",
        employee_gender: "",
        employee_address: "",
        employee_img: "",
        license_id: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formdata,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            Swal.fire({
                icon: 'info',
                title: 'กำลังเข้าสู่ระบบ...',
                text: 'โปรดรอสักครู่ขณะกำลังยืนยันตัวตน',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            const res = await authLogin({
                employee_username: formdata.employee_username,
                employee_password: formdata.employee_password,
            });
            await accessProfile(res.access_token, res.refresh_token, formdata.employee_username);
            await Swal.fire({
                icon: 'success',
                title: 'เข้าสู่ระบบสำเร็จ',
                text: 'คุณกำลังถูกเปลี่ยนเส้นทาง...',
                timer: 2000,
                showConfirmButton: false,
            });
            await router.push('/');
        } catch (error: any) {
            console.error('Login failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'เข้าสู่ระบบล้มเหลว',
                text: error.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
                confirmButtonText: 'ลองอีกครั้ง',
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="flex bg-white shadow-lg rounded-2xl overflow-hidden w-full min-h-[400px] max-w-4xl">
                <div className="w-1/2 flex flex-col items-center justify-center p-4">
                    <img src="/logo.jpg" alt="Logo" className="w-32 h-32 mb-4 rounded-xl" />
                    <Typography variant="body1" className="text-center text-gray-500">
                        ยินดีต้อนรับสู่เว็บไซต์
                    </Typography>
                    <Typography variant="body2" className="text-center text-gray-500">
                        8 บิ้วอิน - รับออกแบบ ตกแต่ง บ้าน ร้านอาหาร คาเฟ่
                    </Typography>
                </div>
                <div className="w-1/2 flex items-center p-6">
                    <div className="w-full">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <TextField
                                label="ชื่อผู้ใช้"
                                name="employee_username"
                                variant="outlined"
                                fullWidth
                                value={formdata.employee_username} // Use 'formdata'
                                onChange={handleChange}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Person />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            border: 'none',
                                            borderBottom: '1px solid #000',
                                        },
                                    },
                                }}
                            />
                            <TextField
                                label="รหัสผ่าน"
                                name="employee_password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                value={formdata.employee_password} // Use 'formdata'
                                onChange={handleChange}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            border: 'none',
                                            borderBottom: '1px solid #000',
                                        },
                                    },
                                }}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="rememberMe"
                                        color="primary"
                                    />
                                }
                                label="จดจำรหัสผ่าน"
                                sx={{
                                    '.MuiTypography-root': {
                                        fontSize: '13px',
                                        color: '#757575',
                                    },
                                }}
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white border-none py-2 px-4 text-[16px] w-full cursor-pointer rounded-xl transition-colors duration-300 hover:bg-blue-600"
                            >
                                เข้าสู่ระบบ
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
