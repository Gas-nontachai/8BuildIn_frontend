"use client";
import { useState } from "react";

import { Checklist, Home, ModeEdit, Timeline } from "@mui/icons-material";
import {
    Tabs, Tab, Button, Breadcrumbs, Typography, Stack, Link, Chip
} from "@mui/material";

import ListTablePR from "@/app/components/StockStore/(PR-PO)/PR/ListTable";
import ListTablePO from "@/app/components/StockStore/(PR-PO)/PO/ListTable";

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
                    <Link underline="hover" href="/product">
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
                            <Home fontSize="small" />
                            <Typography variant="body1" color="primary">หน้าหลัก</Typography>
                        </Stack>
                    </Link>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Checklist fontSize="small" />
                        <Typography variant="body1" color="text.secondary">อนุมัติการเปิดใบ PR/PO</Typography>
                    </Stack>
                </Breadcrumbs>
                {/* <Button variant="contained" color="info" onClick={() => setIsDialogAdd(true)} startIcon={<Add />}>
                    สร้าง PR
                </Button> */}
            </div>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
            >
                <Tab value="pr" label="PR" />
                <Tab value="po" label="PO" />
            </Tabs>

            {value === "pr" && <ListTablePR />}
            {value === "po" && <ListTablePO />}
        </>
    );
};

export default PRPOList;
