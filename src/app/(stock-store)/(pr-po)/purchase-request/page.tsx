"use client";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "@/utils/date-helper"

import { MoreVert, Store, Delete, Add, Home, ModeEdit, Timeline } from "@mui/icons-material";
import {
  MenuItem, Menu, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Breadcrumbs, Typography, Stack, Link, Chip
} from "@mui/material";
import { usePagination } from "@/context/PaginationContext";
import Swal from 'sweetalert2';

import Loading from "@/app/components/Loading";
import PurchaseRequestAdd from "@/app/components/StockStore/(PR-PO)/PR/Add";

import { PurchaseRequest } from '@/misc/types';
import { usePurchaseRequest } from "@/hooks/hooks";

const { getPurchaseRequestBy } = usePurchaseRequest();

const PurchaseRequestPage = () => {
  const { page, setPage, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);

  const [isDialogAdd, setIsDialogAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true);
      const { docs: res } = await getPurchaseRequestBy();
      setPurchaseRequests(res);
    } catch (error) {
      console.log("Error fetching Purchase Request:", error);
    } finally {
      setLoading(false);
    }
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
            <Timeline fontSize="small" />
            <Typography variant="body1" color="text.secondary">เปิด PR</Typography>
          </Stack>
        </Breadcrumbs>
        <Button variant="contained" color="info" onClick={() => setIsDialogAdd(true)} startIcon={<Add />}>
          สร้าง PR
        </Button>
      </div>
      <TableContainer style={{ minHeight: "24rem" }}>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-200">
              <TableCell>#</TableCell>
              <TableCell>รหัส PR</TableCell>
              <TableCell>สถานะ PR</TableCell>
              <TableCell>หมายเหตุ</TableCell>
              <TableCell>เพิ่มโดย</TableCell>
              <TableCell>วันที่เพิ่ม</TableCell>
              <TableCell>ออกบิล</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
              <TableRow hover>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{item.pr_id}</TableCell>
                <TableCell>
                  {item.pr_states === 'pending' ? (
                    <Chip label="Pending" color="warning" />
                  ) : item.pr_states === 'success' ? (
                    <Chip label="Success" color="success" />
                  ) : (
                    <Chip label={item.pr_states} />
                  )}
                </TableCell>
                <TableCell>{item.pr_note}</TableCell>
                <TableCell>{item.addby}</TableCell>
                <TableCell>{formatDate(item.adddate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                <TableCell>ปุ่มออกบิล</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={purchaseRequests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />

      <PurchaseRequestAdd open={isDialogAdd} onClose={() => setIsDialogAdd(false)} onRefresh={() => { }} />
    </>
  )
}

export default PurchaseRequestPage