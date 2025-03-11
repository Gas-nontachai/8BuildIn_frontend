"use client";
import { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';
import { ModeEdit, Delete, Add, MoreVert, Badge, PeopleOutlined } from "@mui/icons-material";
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Breadcrumbs, Menu, MenuItem, Typography, Stack, Link } from "@mui/material";
import { usePagination } from "@/context/PaginationContext";

import AddLicense from "@/app/components/License/Add";
import UpdateLicense from "@/app/components/License/Update";
import Loading from "@/app/components/Loading";

import { useLicense } from "@/hooks/hooks";
import { License } from '@/misc/types';

const { getLicenseBy, deleteLicenseBy } = useLicense();

const LicensePage = () => {
  const { page, setPage, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [licenses, setLicenses] = useState<License[]>([]);
  const license_id = useRef('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<License | null>(null);

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>, license: License) => {
    setAnchorEl(event.currentTarget);
    setSelected(license);
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
    const { docs: res } = await getLicenseBy();
    setPage(0)
    setLicenses(res);
    setLoading(false);
  };

  const onDelete = async (licenseId: string) => {
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
        await deleteLicenseBy({ license_id: licenseId })
        Swal.fire("ลบแล้ว!", "ข้อมูลผู้จัดจำหน่ายถูกลบเรียบร้อยแล้ว", "success");
        await fetchData();
      } catch (error) {
        console.error("Error deleting license:", error);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
          <Link underline="hover" href="/employee">
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
              <Badge fontSize="small" />
              <Typography variant="body1" color="primary">พนักงาน</Typography>
            </Stack>
          </Link>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <PeopleOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body1" color="text.secondary">บทบาท</Typography>
          </Stack>
        </Breadcrumbs>
        <div className="flex gap-2" >
          <Button variant="contained" color="success" onClick={() => setIsAddDialogOpen(true)} startIcon={<Add />}>
            เพิ่มบทบาท
          </Button>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <TableContainer style={{ minHeight: "24rem" }}>
            <Table>
              <TableHead>
                <TableRow className="bg-gray-200" >
                  <TableCell>#</TableCell>
                  <TableCell>ชื่อบทบาท</TableCell>
                  < TableCell> จัดการ </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  licenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                    <TableRow key={item.license_id} hover >
                      <TableCell>{page * rowsPerPage + index + 1} </TableCell>
                      <TableCell>{item.license_name}</TableCell>
                      <TableCell>
                        <IconButton
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
                            license_id.current = selected?.license_id!;
                            handleCloseMenu();
                          }}>
                            <ModeEdit className="mr-2" /> แก้ไข
                          </MenuItem>
                          <MenuItem onClick={() => {
                            onDelete(selected?.license_id!);
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
            count={licenses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </>
      )}
      <AddLicense open={isAddDialogOpen} onRefresh={() => fetchData()} onClose={() => setIsAddDialogOpen(false)} />
      <UpdateLicense open={isUpdateDialogOpen} license_id={license_id.current} onRefresh={() => fetchData()} onClose={() => setIsUpdateDialogOpen(false)} />
    </>
  );
};

export default LicensePage;
