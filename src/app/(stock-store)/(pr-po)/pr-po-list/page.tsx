"use client";
import { useState } from "react";

import { Checklist, Home, Assignment, ReceiptLong } from "@mui/icons-material";
import {
    Tabs, Tab, Button, Breadcrumbs, Typography, Stack, Link, Chip
} from "@mui/material";

import TableListPR from "@/app/components/StockStore/(PR-PO)/PR/TableList";
import TableListPO from "@/app/components/StockStore/(PR-PO)/PO/TableList";

const PRComponent = () => {
    return <div>PR Content</div>;
};

const POComponent = () => {
    return <div>PO Content</div>;
};

const PRPOList = () => {
    const [value, setValue] = useState<string>("pr");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4" >
                <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
                    <Link underline="hover" href="/">
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
                            <Home fontSize="small" />
                            <Typography variant="body1" color="primary">หน้าหลัก</Typography>
                        </Stack>
                    </Link>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <ReceiptLong fontSize="small" />
                        <Typography variant="body1" color="text.secondary">จัดการคำขอซื้อและใบสั่งซื้อ</Typography>
                    </Stack>
                </Breadcrumbs>
                {/* <Button variant="contained" color="info" onClick={() => setIsDialogAdd(true)} startIcon={<Add />}>
                    สร้าง PR
                </Button> */}
            </div>
            <Tabs
                className="mb-4"
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="inherit"
                aria-label="icon label tabs example"
            >
                <Tab
                    value="pr"
                    icon={<Assignment />}
                    label="คำขอซื้อ"
                    sx={{ color: value === "pr" ? '#1976d2' : '#000', backgroundColor: value === "pr" ? '#e3f2fd' : 'transparent' }}
                />
                <Tab
                    value="po"
                    icon={<ReceiptLong />}
                    label="ใบสั่งซื้อ"
                    sx={{ color: value === "po" ? '#1976d2' : '#000', backgroundColor: value === "po" ? '#e3f2fd' : 'transparent' }}
                />
            </Tabs>
            {value === "pr" && <TableListPR />}
            {value === "po" && <TableListPO />}
        </>
    );
};

export default PRPOList;
