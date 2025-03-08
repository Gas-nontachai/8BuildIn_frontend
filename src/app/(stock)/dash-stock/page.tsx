"use client"
import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Collapse,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import CardStock from "@/app/components/Dashboard/Dash-Stock/Card";

const ProductTable = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CardStock />
      <Table>
        <TableHead>
          <TableRow className="bg-gray-200">
            <TableCell />
            <TableCell>รายละเอียดสินค้าและวัสดุ</TableCell>
            <TableCell>#</TableCell>
            <TableCell>จำนวน</TableCell>
            <TableCell>ราคารวม</TableCell>
            <TableCell>ผู้จำหน่าย</TableCell>
            <TableCell>ชื่อพนักงาน</TableCell>
            <TableCell>วันเวลาถูกเพิ่ม</TableCell>
            <TableCell>หมายเหตุ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow hover>
            <TableCell>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </TableCell>
            <TableCell>สินค้า A</TableCell>
            <TableCell>001</TableCell>
            <TableCell>10</TableCell>
            <TableCell>1,000 บาท</TableCell>
            <TableCell>บริษัท XYZ</TableCell>
            <TableCell>สมชาย นามสมมติ</TableCell>
            <TableCell>2025-03-08 12:30</TableCell>
            <TableCell>สินค้าคุณภาพสูง</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    ประวัติการซื้อ
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>วันที่</TableCell>
                        <TableCell>ลูกค้า</TableCell>
                        <TableCell align="right">จำนวน</TableCell>
                        <TableCell align="right">ราคารวม (บาท)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>2025-03-07</TableCell>
                        <TableCell>ลูกค้า A</TableCell>
                        <TableCell align="right">5</TableCell>
                        <TableCell align="right">500 บาท</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default ProductTable;
