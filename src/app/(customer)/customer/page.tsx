"use client";
import { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';
import { API_URL } from '@/utils/config';
import { ModeEdit, Delete, Add } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, CircularProgress } from "@mui/material";
import { usePagination } from "@/context/PaginationContext";

import AddCustomer from "@/app/components/Customer/Add";
import UpdateCustomer from "@/app/components/Customer/Update";

import { useCustomer } from "@/hooks/hooks";
import { Customer } from '@/misc/types';

const { getCustomerBy, deleteCustomerBy } = useCustomer();

const CustomerPage = () => {
  const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const customer_id = useRef('')

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { docs: res } = await getCustomerBy();
    setCustomers(res);
    setLoading(false);
  };

  const onDelete = async (customerId: string) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณจะไม่สามารถย้อนกลับการกระทำนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteCustomerBy({ customer_id: customerId })
        Swal.fire("ลบแล้ว!", "ข้อมูลผู้จัดจำหน่ายถูกลบเรียบร้อยแล้ว", "success");
        await fetchData();
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <span className="text-xl font-[400]" >ลูกค้าทั้งหมด</span>
        < div className="flex gap-2" >
          <Button variant="contained" color="primary" onClick={() => setIsAddDialogOpen(true)} startIcon={<Add />}>
            เพิ่มลูกค้า
          </Button>
        </div>
      </div>

      {
        loading ? (
          <div className="flex justify-center flex-col items-center py-4 text-[15px]" >
            <CircularProgress />
            < span className="mt-3" > กำลังโหลดข้อมูล...</span>
          </div>
        ) : (
          <Paper className="shadow-md" >
            <TableContainer style={{ minHeight: "24rem" }}>
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-200">
                    <TableCell align="center">#</TableCell>
                    <TableCell align="center">คำนำหน้า</TableCell>
                    <TableCell align="center">ชื่่อ</TableCell>
                    <TableCell align="center">นามสกุล</TableCell>
                    <TableCell align="center">อีเมล</TableCell>
                    <TableCell align="center">เบอร์โทร</TableCell>
                    <TableCell align="center">วัน/เดือน/ปีเกิด</TableCell>
                    <TableCell align="center">เพศ</TableCell>
                    <TableCell align="center">ที่อยู่</TableCell>
                    <TableCell align="center">จัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                      <TableRow key={item.customer_id} hover >
                        <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell align="center">{item.customer_prefix}</TableCell>
                        <TableCell align="center">{item.customer_firstname}</TableCell>
                        <TableCell align="center">{item.customer_lastname}</TableCell>
                        <TableCell align="center">{item.customer_email}</TableCell>
                        <TableCell align="center">{item.customer_phone}</TableCell>
                        <TableCell align="center">{item.customer_birthday}</TableCell>
                        <TableCell align="center">{item.customer_gender}</TableCell>
                        <TableCell align="center">{item.customer_address}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2" >
                            <Button
                              variant="outlined"
                              size="small"
                              color="primary"
                              startIcon={< ModeEdit />}
                              onClick={() => {
                                setIsUpdateDialogOpen(true);
                                customer_id.current = item.customer_id;
                              }
                              }
                            >
                              แก้ไข
                            </Button>
                            < Button variant="outlined"
                              size="small" color="error" startIcon={< Delete />}
                              onClick={() => onDelete(item.customer_id)}>
                              ลบ
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            < TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={customers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </Paper>
        )}

      <AddCustomer open={isAddDialogOpen} onRefresh={() => fetchData()} onClose={() => setIsAddDialogOpen(false)} />
      <UpdateCustomer open={isUpdateDialogOpen} customer_id={customer_id.current} onRefresh={() => fetchData()} onClose={() => setIsUpdateDialogOpen(false)} />
    </>
  );
};

export default CustomerPage;
