"use client"
import React, { useEffect, useState } from 'react';
import { API_URL } from '@/utils/config';
import { useSearchParams, useRouter } from 'next/navigation';
import { Employee } from "@/misc/types";
import { useEmployee } from "@/hooks/hooks";
import Loading from '@/app/components/Loading';
import { PersonOutlined, FirstPage } from "@mui/icons-material";
import { Button, Grid, Stack, Link, Typography, Breadcrumbs, Card, CardContent } from "@mui/material";
import { formatDate } from "@/utils/date-helper"

const { getEmployeeByID } = useEmployee();

const EmployeeDetail = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const employee_id = searchParams.get('id');

    const [loading, setLoading] = useState(false);
    const [employeeData, setEmployeeData] = useState<Employee | null>(null);

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

    return (
        <>
            <div className="flex justify-start">
                <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
                    <Link underline="hover" onClick={() => router.back()}>
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main', cursor: 'pointer' }}>
                            <FirstPage fontSize="small" />
                            <Typography variant="body1" color="primary">ย้อนกลับ</Typography>
                        </Stack>
                    </Link>
                </Breadcrumbs>
            </div>
            {loading ? (
                <Loading />
            ) : (
                employeeData && (
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4} container justifyContent="center" alignItems="center">
                                <img
                                    src={employeeData.employee_img ? `${API_URL}${employeeData.employee_img}` : "/default-emp.jpg"}
                                    alt="Profile"
                                    className='w-64 h-64 rounded-full object-cover'
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h6">{employeeData.employee_prefix} {employeeData.employee_firstname} {employeeData.employee_lastname}</Typography>
                                <Typography variant="body1">อีเมล: {employeeData.employee_email}</Typography>
                                <Typography variant="body1">เบอร์โทร: {employeeData.employee_phone}</Typography>
                                <Typography variant="body1">ที่อยู่: {employeeData.employee_address}</Typography>
                                <Typography variant="body1">วันเกิด: {formatDate(employeeData.employee_birthday)}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                )
            )}
        </>
    );
};

export default EmployeeDetail;
