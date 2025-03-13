"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/date-helper"
import { Add, Home, Assignment, Description } from "@mui/icons-material";
import {
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, TablePagination, Button, Breadcrumbs, Typography, Stack, Link, Box
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
  const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
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
      console.log("res", res);
    } catch (error) {
      console.log("Error fetching Purchase Request:", error);
    } finally {
      setLoading(false);
    }
  };

  const openPDF = async (prData: PurchaseRequest) => {
    try {
      const blob = await pdf(<PR prData={prData} />).toBlob();
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
      </div>
      <div className="flex justify-between item-center mb-3">
        <TextField
          variant="outlined"
          size="small"
          placeholder="ค้นหารหัสคำขอซื้อ..."
          className="w-64"
        />
        <Button variant="contained" color="info" size="small" onClick={() => setIsDialogAdd(true)} startIcon={<Add />}>
          เปิดใบคำขอซื้อ
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
                <TableCell align="center">รหัสคำขอซื้อ</TableCell>
                <TableCell align="center">สถานะคำขอซื้อ</TableCell>
                <TableCell align="center">หมายเหตุ</TableCell>
                <TableCell align="center">เพิ่มโดย</TableCell>
                <TableCell align="center">วันที่เพิ่ม</TableCell>
                <TableCell align="center">อัพเดทล่าสุด</TableCell>
                <TableCell align="center">ออกบิล</TableCell>
              </TableRow >
            </TableHead >
            <TableBody>
              {purchaseRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                <TableRow key={item.pr_id} hover>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center">{item.pr_id}</TableCell>
                  <TableCell align="center">
                    {item.pr_status === 'pending' ? (
                      <span className="inline-block px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-white bg-orange-500">
                        รอดำเนินการ
                      </span>
                    ) : item.pr_status === 'approved' ? (
                      <span className="inline-block px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-white bg-green-600">
                        อนุมัติแล้ว
                      </span>
                    ) : item.pr_status === 'success' ? (
                      <span className="inline-block px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-white bg-blue-500">
                        สั่งซื้อสำเร็จ
                      </span>
                    ) : item.pr_status === 'not-approved' ? (
                      <span className="inline-block px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-white bg-red-500">
                        ไม่อนุมัติ
                      </span>
                    ) : (
                      <span className="inline-block px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-black bg-gray-300">
                        {item.pr_status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell align="center">{item.pr_note}</TableCell>
                  <TableCell align="center">{item.addby}</TableCell>
                  <TableCell align="center">{formatDate(item.adddate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                  <TableCell align="center">{formatDate(item.lastupdate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <Button
                        size="small"
                        onClick={() => openPDF(item)}
                        color="info"
                        variant="contained"
                        startIcon={<Description />}
                        aria-label="Open PDF"
                        sx={{
                          backgroundColor: "#ef4036",
                          color: "#fff",
                          textTransform: "none",
                          borderRadius: "12px",
                          padding: "3px 4px",
                          transition: "0.3s",
                          "&:hover": {
                            boxShadow: 6,
                            backgroundColor: "#ff2116",
                          }
                        }}
                      >
                        PDF
                      </Button>
                    </Box>
                  </TableCell>
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