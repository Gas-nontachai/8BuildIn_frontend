"use client";
import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from "@mui/material"
import { useEffect, useState } from "react"
import useCustomer from "@/hooks/useCustomers";
import { Customer } from '@/misc/types'
import { usePagination } from "@/context/PaginationContext";
import Swal from 'sweetalert2';


const CustomerPage = () => {
  const [loading, setLoading] = useState(false);
  const [Customers, setCustomers] = useState<Customer[]>([]);
  const { getCustomerBy } = useCustomer();
  const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { docs: res } = await getCustomerBy();
      setCustomers(res);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
    setLoading(false);
  };

  const onDelete = async (CustomerId: string) => {
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
        Swal.fire("ลบแล้ว!", "ข้อมูลผู้จัดจำหน่ายถูกลบเรียบร้อยแล้ว", "success");
        await fetchData();
      } catch (error) {
        console.error("Error deleting material:", error);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <span className="text-xl font-[400]">ลูกค้า</span>
        <div className="flex gep-2">
          <Button variant="contained" color="primary">
            เพิ่มลูกค้า
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center flex-col items-center py-4 text-[15px]">
          <CircularProgress />
          <span className="mt-3">กำลังโหลดข้อมูล...</span>
        </div>
      ) : (
        <Paper className="shadow-md">
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
              {Customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer, index) => (
                <TableRow key={customer.customer_id} hover>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center">{customer.customer_prefix}</TableCell>
                  <TableCell align="center">{customer.customer_firstname}</TableCell>
                  <TableCell align="center">{customer.customer_lastname}</TableCell>
                  <TableCell align="center">{customer.customer_email}</TableCell>
                  <TableCell align="center">{customer.customer_phone}</TableCell>
                  <TableCell align="center">{customer.customer_birthday}</TableCell>
                  <TableCell align="center">{customer.customer_gender}</TableCell>
                  <TableCell align="center">{customer.customer_address}</TableCell>
                  <TableCell align="center">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded">แก้ไข</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded ml-2">ลบ</button>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={Customers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Paper>
      )}

    </>
  )
}
export default CustomerPage

