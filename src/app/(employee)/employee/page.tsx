"use client";
import { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';
import { API_URL } from '@/utils/config';
import { MoreVert, ModeEdit, Delete, Add, Search } from "@mui/icons-material";
import { MenuItem, Menu, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, CircularProgress, TextField, InputAdornment } from "@mui/material";
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
  const [search, setSearch] = useState("")
  const employee_id = useRef('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<Employee | null>(null);

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>, employee: Employee) => {
    setAnchorEl(event.currentTarget);
    setSelected(employee);
  }; 
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelected(null);
  };

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
  const handleSearch = async () => {
    setLoading(true);
    const { docs: res } = await getEmployeeBy();
    const filterData = res.filter((item: any) =>
      item.employee_firstname.toLowerCase().includes(search.toLowerCase()) ||
      item.employee_lastname.toLowerCase().includes(search.toLowerCase())
    );
    setEmployees(filterData);
    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-start mb-2">
        <span className="text-xl font-[400]" >พนักงานทั้งหมด</span>
      </div>
      <div className="flex justify-between mb-2">
        <TextField
          variant="outlined"
          size="small"
          placeholder="ค้นหาชื่อพนักงงาน..."
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary" onClick={() => setIsAddDialogOpen(true)} startIcon={<Add />}>
          เพิ่มพนักงาน
        </Button>
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
                          <div className="flex justify-center gap-2">
                            <IconButton
                              size="small"
                              onClick={(e) => handleClickMenu(e, item)}
                            >
                              <MoreVert />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleCloseMenu}
                            >
                              <MenuItem onClick={() => {
                                setIsUpdateDialogOpen(true);
                                employee_id.current = selected?.employee_id!;
                                handleCloseMenu();
                              }}>
                                <ModeEdit className="mr-2" /> แก้ไข
                              </MenuItem>
                              <MenuItem onClick={() => {
                                onDelete(selected?.employee_id!);
                                handleCloseMenu();
                              }}>
                                <Delete className="mr-2" /> ลบ
                              </MenuItem>
                            </Menu>
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
