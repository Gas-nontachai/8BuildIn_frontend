"use client"
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { API_URL } from '@/utils/config';
import { useSearchParams } from 'next/navigation';

import { Employee, License } from "@/misc/types";
import { useEmployee, useLicense } from "@/hooks/hooks";

import Loading from '@/app/components/Loading';

const { getEmployeeByID, updateEmployeeBy } = useEmployee();
const { getLicenseBy } = useLicense();


import { UploadFile, VisibilityOff, Visibility, PersonOutlined, Home } from "@mui/icons-material";
import {
    Button, TextField, IconButton, Grid, MenuItem, Select, FormControl, Stack, Link, Typography, Breadcrumbs, Card, CardContent
} from "@mui/material";

const EditProfile = () => {
    const searchParams = useSearchParams()
    const employee_id = searchParams.get('id');

    const initialState: Employee = {
        employee_id: '',
        employee_username: '',
        employee_password: '',
        employee_prefix: '',
        employee_firstname: '',
        employee_lastname: '',
        employee_email: '',
        employee_phone: '',
        employee_birthday: '',
        employee_gender: '',
        employee_address: '',
        employee_img: '',
        license_id: '',
        addby: '',
        adddate: '',
        updateby: '',
        lastupdate: '',
    };

    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const prefix_name = [
        { prefix: "นาย" },
        { prefix: "นาง" },
        { prefix: "นางสาว" }
    ];
    const gender = [
        { prefix: "ชาย" },
        { prefix: "หญิง" },
        { prefix: "อื่นๆ" }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getEmployeeByID({ employee_id: employee_id as string });
            setEmployeeData(res);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const [employeeData, setEmployeeData] = useState<Employee>(initialState);
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setEmployeeData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedImage(URL.createObjectURL(file));
            setFiles([file]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateEmployeeBy({
                employee: employeeData,
                employee_img: files.length > 0 ? files : []
            });
            setEmployeeData(initialState);
            setSelectedImage(null);
            Swal.fire({
                title: "สำเร็จ!",
                text: "แก้ไขข้อมูลพนักงานเรียบร้อยแล้ว",
                icon: "success",
                confirmButtonText: "ตกลง",
            });
            await fetchData()
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="flex justify-start">
                <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
                    <Link underline="hover" href="/">
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
                            <Home fontSize="small" />
                            <Typography variant="body1" color="primary">หน้าหลัก</Typography>
                        </Stack>
                    </Link>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <PersonOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body1" color="text.secondary">แก้ไขโปรไฟล์</Typography>
                    </Stack>
                </Breadcrumbs>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={8}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={2}>
                                            <FormControl fullWidth margin="normal">
                                                <Select
                                                    name="employee_gender"
                                                    size="small"
                                                    value={employeeData.employee_gender}
                                                    onChange={handleChange}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="" disabled>เพศ</MenuItem>
                                                    {gender.map((item, index) => (
                                                        <MenuItem key={index} value={item.prefix}>
                                                            {item.prefix}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <FormControl fullWidth margin="normal">
                                                <Select
                                                    name="employee_prefix"
                                                    size="small"
                                                    value={employeeData.employee_prefix}
                                                    onChange={handleChange}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="" disabled>คำนำหน้า</MenuItem>
                                                    {prefix_name.map((item, index) => (
                                                        <MenuItem key={index} value={item.prefix}>
                                                            {item.prefix}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="ชื่อ"
                                                size="small"
                                                name="employee_firstname"
                                                value={employeeData.employee_firstname}
                                                onChange={handleChange}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="นามสกุล"
                                                size="small"
                                                name="employee_lastname"
                                                value={employeeData.employee_lastname}
                                                onChange={handleChange}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="อีเมล"
                                                size="small"
                                                name="employee_email"
                                                value={employeeData.employee_email}
                                                onChange={handleChange}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="ชื่อผู้ใช้งาน"
                                                size="small"
                                                name="employee_username"
                                                value={employeeData.employee_username}
                                                onChange={handleChange}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="รหัสผ่าน"
                                                type={showPassword ? 'text' : 'password'}
                                                size="small"
                                                name="employee_password"
                                                value={employeeData.employee_password}
                                                onChange={handleChange}
                                                fullWidth
                                                margin="normal"
                                                InputProps={{
                                                    endAdornment: (
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="เบอร์โทรศัพท์"
                                                size="small"
                                                name="employee_phone"
                                                value={employeeData.employee_phone}
                                                onChange={handleChange}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="วันเกิด"
                                                size="small"
                                                name="employee_birthday"
                                                type="date"
                                                value={employeeData.employee_birthday}
                                                onChange={handleChange}
                                                fullWidth
                                                margin="normal"
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                label="ที่อยู่"
                                                name="employee_address"
                                                value={employeeData.employee_address}
                                                onChange={handleChange}
                                                fullWidth
                                                margin="normal"
                                                multiline
                                                rows={3}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={4} container justifyContent="center" alignItems="center">
                                    <div className="flex justify-center flex-col items-center">
                                        {selectedImage || loading ? (
                                            <div>
                                                {loading ? (
                                                    <Loading />
                                                ) : (
                                                    <img
                                                        src={selectedImage || `${API_URL}${employeeData.employee_img}` || "/default-emp.jpg"}
                                                        alt="Selected"
                                                        className="w-64 h-64 rounded-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <img
                                                src={`${API_URL}${employeeData.employee_img}` || "/default-emp.jpg"}
                                                alt="Selected"
                                                className='w-64 h-64 rounded-full object-cover'
                                            />
                                        )}
                                        <div className="mt-2">
                                            <label htmlFor="upload-image">
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    color="primary"
                                                    startIcon={<UploadFile />}
                                                >
                                                    เลือกไฟล์
                                                </Button>
                                            </label>
                                            <input
                                                id="upload-image"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                            <div className="flex justify-center items-center mt-10">
                                <Button className='w-auto' type="submit" color="success" variant="contained">
                                    บันทึก
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default EditProfile;
