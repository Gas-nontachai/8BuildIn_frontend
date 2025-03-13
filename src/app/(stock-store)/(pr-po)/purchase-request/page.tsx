"use client";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { formatDate } from "@/utils/date-helper"

import { Add, Home, Assignment, Description, Search } from "@mui/icons-material";
import {
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, TablePagination, Button, Breadcrumbs, Typography, Stack, Link, Chip,
  InputAdornment
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
  const [search, setSearch] = useState<string>("");
  const [selectedPurchaseRequest] = useState<string>("");

  const fatchPurchaseRequest = async () => {
    setLoading(true);
    try {
      const { docs } = await getPurchaseRequestBy({
        search: {
          text: search,
          columns: ["pr_id"],
          condition: "LIKE",
        },
        match: selectedPurchaseRequest ? { pr_id: selectedPurchaseRequest } : {}
      });
      setPurchaseRequests(docs)
    } catch (error) {
      console.error("Error fetching customer:", error);
    } finally {
      setLoading(false);
    }
  }

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
      <div className="flex justify-between items-center mb-3" >
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
          <Link underline="hover" href="/product">
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
              <Home fontSize="small" />
              <Typography variant="body1" color="primary">หน้าหลัก</Typography>
            </Stack>
          </Link>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Assignment fontSize="small" />
            <Typography variant="body1" color="text.secondary">คำขอซื้อ</Typography>
          </Stack>
        </Breadcrumbs>
        <Button variant="contained" color="primary" onClick={() => setIsDialogAdd(true)} startIcon={<Add />}>
          เปิดใบคำขอซื้อ
        </Button>
      </div>
      <div className="flex justify-between mb-3">
        <TextField
          variant="outlined"
          size="small"
          placeholder="ค้นหารหัสคำขอซื้อ..."
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" onClick={fatchPurchaseRequest} className="cursor-pointer">
                <Search />
              </InputAdornment>
            ),
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fatchPurchaseRequest();
            }
          }}
        />
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
                <TableCell>อัพเดทล่าสุด</TableCell>
                <TableCell align="center">ออกบิล</TableCell>
              </TableRow >
            </TableHead >
            <TableBody>
              {purchaseRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                <TableRow key={item.pr_id} hover>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{item.pr_id}</TableCell>
                  <TableCell>
                    {item.pr_status === 'pending' ? (
                      <span className="inline-block px-1 py-0.5 rounded-md text-[13px] font-[400] text-white bg-yellow-500">
                        รอดำเนินการ
                      </span>
                    ) : item.pr_status === 'approved' ? (
                      <span className="inline-block px-1 py-0.5 rounded-md text-[13px] font-[400] text-white bg-green-600">
                        อนุมัติแล้ว
                      </span>
                    ) : item.pr_status === 'not-approved' ? (
                      <span className="inline-block px-1 py-0.5 rounded-md text-[13px] font-[400] text-white bg-red-500">
                        ไม่อนุมัติ
                      </span>
                    ) : (
                      <span className="inline-block px-1 py-0.5 rounded-md text-[13px] font-[400] text-black bg-gray-300">
                        {item.pr_status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{item.pr_note}</TableCell>
                  <TableCell>{item.addby}</TableCell>
                  <TableCell align="center">{formatDate(item.adddate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                  <TableCell>{formatDate(item.lastupdate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                  <TableCell align="center"><Button size="small" onClick={openPDF} color="info"><Description /> PDF</Button></TableCell>
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