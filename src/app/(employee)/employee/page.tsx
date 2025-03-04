"use client";
import { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';
import { API_URL } from '@/utils/config';
import { ModeEdit, Delete, Add } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, CircularProgress } from "@mui/material";
import { usePagination } from "@/context/PaginationContext";

import AddEmployee from "@/app/components/Employee/Add";
import UpdateEmployee from "@/app/components/Employee/Update";

import { useEmployee } from "@/hooks/hooks";
import { Employee } from '@/misc/types';

const { getEmployeeBy, deleteEmployeeBy } = useEmployee();

const EmployeePage = () => {
  const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const employee_id = useRef('')

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { docs: res } = await getEmployeeBy();
    setEmployees(res);
    setLoading(false);
  };

  const onDelete = async (employeeId: string) => {
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
        await deleteEmployeeBy({ employee_id: employeeId })
        Swal.fire("ลบแล้ว!", "ข้อมูลผู้จัดจำหน่ายถูกลบเรียบร้อยแล้ว", "success");
        await fetchData();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <span className="text-xl font-[400]" >พนักงานทั้งหมด</span>
        < div className="flex gap-2" >
          <Button variant="contained" color="primary" onClick={() => setIsAddDialogOpen(true)} startIcon={<Add />}>
            เพิ่มพนักงาน
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
                  <TableRow className="bg-gray-200" >
                    <TableCell>#</TableCell>
                    <TableCell>รูปภาพ</TableCell>
                    < TableCell >ชื่อ-นามสกุล</TableCell>
                    < TableCell >เบอร์โทรศัพท์</TableCell>
                    < TableCell >ที่อยู่</TableCell>
                    < TableCell align="center" > จัดการ </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                      <TableRow key={item.employee_id} hover >
                        <TableCell>{index + 1} </TableCell>
                        <TableCell>
                          <img
                            className="w-8 h-8 rounded-full "
                            src={item.employee_img ? `${API_URL}${item.employee_img}` : 'default-emp.jpg'}
                            alt="Employee"
                          />
                        </TableCell>
                        <TableCell>{item.employee_prefix} {item.employee_firstname} {item.employee_lastname} </TableCell>
                        <TableCell>{item.employee_phone}</TableCell>
                        <TableCell>{item.employee_address}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2" >
                            <Button
                              variant="outlined"
                              size="small"
                              color="primary"
                              startIcon={< ModeEdit />}
                              onClick={() => {
                                setIsUpdateDialogOpen(true);
                                employee_id.current = item.employee_id;
                              }
                              }
                            >
                              แก้ไข
                            </Button>
                            < Button variant="outlined"
                              size="small" color="error" startIcon={< Delete />}
                              onClick={() => onDelete(item.employee_id)}>
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
              count={employees.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </Paper>
        )}

      <AddEmployee open={isAddDialogOpen} onRefresh={() => fetchData()} onClose={() => setIsAddDialogOpen(false)} />
      <UpdateEmployee open={isUpdateDialogOpen} employee_id={employee_id.current} onRefresh={() => fetchData()} onClose={() => setIsUpdateDialogOpen(false)} />
    </>
  );
};

export default EmployeePage;
