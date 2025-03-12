"use client";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { formatDate } from "@/utils/date-helper"

import { Add, Home, Timeline, Receipt } from "@mui/icons-material";
import {
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Breadcrumbs, Typography, Stack, Link, Chip
} from "@mui/material";

import Loading from "@/app/components/Loading";
import PurchaseRequestAdd from "@/app/components/StockStore/(PR-PO)/PR/Add";
import { usePagination } from "@/context/PaginationContext";

import { PurchaseRequest } from '@/misc/types';
import { usePurchaseRequest } from "@/hooks/hooks";
import { pdf } from '@react-pdf/renderer';
import PR from "@/app/components/StockStore/(PDF)/PR";
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

  const openPDF = async () => {
    try {
      const blob = await pdf(<PR />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error("Error generating PDF:", error);
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
      {loading ? (
        <Loading />
      ) : (
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
              </TableRow >
            </TableHead >
            <TableBody>
              {purchaseRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                <TableRow key={item.pr_id} hover>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{item.pr_id}</TableCell>
                  <TableCell>
                    {item.pr_status === 'pending' ? (
                      <Chip label="Pending" color="warning" size="small" />
                    ) : item.pr_status === 'approve' ? (
                      <Chip label="Approve" color="success" size="small" />
                    ) : (
                      <Chip label={item.pr_status} />
                    )}
                  </TableCell>
                  <TableCell>{item.pr_note}</TableCell>
                  <TableCell>{item.addby}</TableCell>
                  <TableCell>{formatDate(item.adddate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                  <TableCell><Button onClick={openPDF} startIcon={<Receipt />}>ออกบิล</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table >
        </TableContainer >
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={purchaseRequests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />

      <PurchaseRequestAdd open={isDialogAdd} onClose={() => setIsDialogAdd(false)} onRefresh={async () => { await fetchData() }} />
    </>
  )
}

export default PurchaseRequestPage