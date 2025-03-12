"use client";
import { useEffect, useRef, useState } from "react";
import { API_URL } from '@/utils/config';
import Swal from 'sweetalert2';
import { MoreVert, ModeEdit, Delete, Add, Home, Store } from "@mui/icons-material";
import {
  MenuItem, Menu, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Breadcrumbs, Typography, Stack, Link,
} from "@mui/material";
import { usePagination } from "@/context/PaginationContext";

import AddSupplier from "@/app/components/StockStore/Supplier/Add";
import UpdateSupplier from "@/app/components/StockStore/Supplier/Update";
import Loading from "@/app/components/Loading";

import useSupplier from "@/hooks/useSupplier";
import { Supplier } from '@/misc/types';

const { getSupplierBy, deleteSupplierBy } = useSupplier();

const SupplierPage = () => {
  const { page, setPage, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const supplier_id = useRef('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<Supplier | null>(null);
  const handleClickMenu = (event: React.MouseEvent<HTMLElement>, supplier: Supplier) => {
    setAnchorEl(event.currentTarget);
    setSelected(supplier);
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
    try {
      const { docs: res } = await getSupplierBy();
      setPage(0)
      setSuppliers(res);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
    setLoading(false);
  };

  const onDelete = async (supplierId: string) => {
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
        await deleteSupplierBy({ supplier_id: supplierId })
        Swal.fire("ลบแล้ว!", "ข้อมูลผู้จัดจำหน่ายถูกลบเรียบร้อยแล้ว", "success");
        await fetchData();
      } catch (error) {
        console.error("Error deleting supplier:", error);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
          <Link underline="hover" href="/">
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
              <Home fontSize="small" />
              <Typography variant="body1" color="primary">หน้าหลัก</Typography>
            </Stack>
          </Link>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Store fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body1" color="text.secondary">ข้อมูลผู้จัดจำหน่าย</Typography>
          </Stack>
        </Breadcrumbs>
        < div className="flex gap-2" >
          <Button variant="contained" color="success" onClick={() => setIsAddDialogOpen(true)} startIcon={<Add />}>
            เพิ่มผู้จัดจำหน่าย
          </Button>
        </div>
      </div>
      {
        loading ? (
          <Loading />
        ) : (
          <>
            <TableContainer style={{ minHeight: "24rem" }}>
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-200" >
                    <TableCell>#</TableCell>
                    < TableCell > โลโก้ </TableCell>
                    < TableCell > ชื่อผู้จัดจำหน่าย </TableCell>
                    < TableCell > ช่องทางการติดต่อ </TableCell>
                    < TableCell align="center" > จัดการ </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(suppliers || []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((supplier, index) => (
                    <TableRow key={supplier.supplier_id} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell><img src={`${API_URL}${supplier.supplier_img}`} className="w-16 h-16 object-cover" alt="" /></TableCell>
                      <TableCell>{supplier.supplier_name}</TableCell>
                      <TableCell>
                        {supplier.supplier_contact
                          ? JSON.parse(supplier.supplier_contact).map((contact: { type: string; value: string }) => (
                            <div key={contact.value}>• {contact.type}: {contact.value}</div>
                          ))
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <IconButton size="small" onClick={(e) => handleClickMenu(e, supplier)}>
                            <MoreVert />
                          </IconButton>
                          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                            <MenuItem onClick={() => {
                              setIsUpdateDialogOpen(true);
                              supplier_id.current = selected?.supplier_id ?? "";
                              handleCloseMenu();
                            }}>
                              <ModeEdit className="mr-2" /> แก้ไข
                            </MenuItem>
                            <MenuItem onClick={() => {
                              if (selected?.supplier_id) {
                                onDelete(selected.supplier_id);
                              }
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
              count={suppliers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </>
        )}

      <AddSupplier open={isAddDialogOpen} onRefresh={() => fetchData()} onClose={() => setIsAddDialogOpen(false)} />
      <UpdateSupplier open={isUpdateDialogOpen} supplier_id={supplier_id.current} onRefresh={() => fetchData()} onClose={() => setIsUpdateDialogOpen(false)} />

    </>
  );
};

export default SupplierPage;
