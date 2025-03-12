"use client";
import { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';
import { API_URL } from '@/utils/config';
import { MoreVert, ModeEdit, Delete, Add, Search, Home, Badge } from "@mui/icons-material";
import {
  MenuItem, Menu, IconButton, Table, TableBody, TableCell, Card,
  TableContainer, TableHead, TableRow, CardContent, TablePagination, Button, Breadcrumbs, TextField, InputAdornment, Typography, Stack, Link, Divider
} from "@mui/material";
import { usePagination } from "@/context/PaginationContext";

import AddEmployee from "@/app/components/HRMS/Employee/Add";
import UpdateEmployee from "@/app/components/HRMS/Employee/Update";
import Loading from "@/app/components/Loading";

import { useEmployee, useLicense } from "@/hooks/hooks";
import { Employee, License } from '@/misc/types';

const { getEmployeeBy, deleteEmployeeBy } = useEmployee();
const { getLicenseBy } = useLicense();

const EmployeePage = () => {
  const { page, setPage, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [license, setLicense] = useState<License[]>([]);
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
    const { docs: res } = await getEmployeeBy({
      search: {
        text: search,
        columns: ["employee_firstname", "employee_lastname", "employee_id"],
        condition: "LIKE",
      },
    });
    const license_id = res.map(item => item.license_id)
    const { docs: license_list } = await getLicenseBy({
      match: {
        license_id: { $in: license_id }
      }
    })
    setPage(0)
    setEmployees(res);
    setLicense(license_list)
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
      <div className="flex justify-between items-center">
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
          <Link underline="hover" href="/">
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
              <Home fontSize="small" />
              <Typography variant="body1" color="primary">หน้าหลัก</Typography>
            </Stack>
          </Link>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Badge fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body1" color="text.secondary">พนักงงาน</Typography>
          </Stack>
        </Breadcrumbs>
        <div className="flex gap-2">
          <Button variant="contained" color="success" onClick={() => setIsAddDialogOpen(true)} startIcon={<Add />}>
            เพิ่มพนักงาน
          </Button>
          <Button variant="contained" color="primary" href="/license">
            จัดการบทบาท
          </Button>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between mb-3">
            <TextField
              variant="outlined"
              size="small"
              placeholder="ค้นหาชื่อพนักงาน..."
              className="w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchData();
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
          </div>
          <TableContainer style={{ minHeight: "24rem" }}>
            <Table>
              <TableHead>
                <TableRow className="bg-gray-200" >
                  <TableCell>#</TableCell>
                  {/* <TableCell>รูปภาพ</TableCell> */}
                  < TableCell >ชื่อ-นามสกุล</TableCell>
                  < TableCell >บทบาท</TableCell>
                  < TableCell >เบอร์โทรศัพท์</TableCell>
                  < TableCell >ที่อยู่</TableCell>
                  < TableCell> จัดการ </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                  <TableRow key={item.employee_id} hover >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    {/* <TableCell>
                      <img
                        className="w-8 h-8 rounded-full "
                        src={item.employee_img ? `${API_URL}${item.employee_img}` : 'default-emp.jpg'}
                        alt="Employee"
                      />
                    </TableCell> */}
                    <TableCell>{item.employee_prefix} {item.employee_firstname} {item.employee_lastname} </TableCell>
                    <TableCell>
                      {license.find((l) => l.license_id === item.license_id)?.license_name ||
                        <span className="text-[12px] text-gray-500">ยังไม่มีบทบาท</span>}
                    </TableCell>
                    <TableCell>{item.employee_phone}</TableCell>
                    <TableCell>{item.employee_address}</TableCell>
                    <TableCell>
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
        </>
      )}

      <AddEmployee open={isAddDialogOpen} onRefresh={() => fetchData()} onClose={() => setIsAddDialogOpen(false)} />
      <UpdateEmployee open={isUpdateDialogOpen} employee_id={employee_id.current} onRefresh={() => fetchData()} onClose={() => setIsUpdateDialogOpen(false)} />

    </>
  );
};

export default EmployeePage;
