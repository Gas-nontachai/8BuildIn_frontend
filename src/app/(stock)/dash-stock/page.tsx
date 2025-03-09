"use client"
import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  AppBar,
  Tab,
  Box,
  Tabs,
  Card,
  CardContent,
  Typography
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import CardStock from "@/app/components/Dashboard/Dash-Stock/Card";

import ProductTableData from "@/app/components/Dashboard/Dash-Stock/Product";
import MaterialTableData from "@/app/components/Dashboard/Dash-Stock/Material";


const ProductTable = () => {
  const [value, setValue] = useState(0);

  const TabPanel = ({ children, value, index }: any) => {
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box p={3}>{children}</Box>}
      </div>
    );
  };

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <>
      <CardStock />
      <Card>
        <CardContent>
          <Typography variant="h6">📊  </Typography>
          <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
            <AppBar position="static">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="secondary"
                textColor="inherit"
                aria-label="full width tabs example"
              >
                <Tab label="Product" />
                <Tab label="Material" />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <ProductTableData />
              <Typography>ข้อมูลสินค้า</Typography>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <MaterialTableData />
              <Typography> ข้อมูลวัตถุดิบ</Typography>
            </TabPanel>
          </Box>
        </CardContent>
      </Card >
    </>
  );
};

export default ProductTable;
