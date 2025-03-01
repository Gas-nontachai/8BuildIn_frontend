"use client";
import { useEffect, useRef, useState } from "react";
import { ModeEdit, Delete, Add, Edit, ManageAccounts } from "@mui/icons-material";
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, CircularProgress, Checkbox } from "@mui/material";
import { usePagination } from "@/context/PaginationContext";

import UpdateMaterial from "@/app/components/Material/Update";
import ManageMaterialCategory from "@/app/components/MaterialCategory/Manage";

import useSupplier from "@/hooks/useSupplier";
import { Supplier } from '@/misc/types';

const { getSupplierBy, deleteSupplierBy } = useSupplier();

const MaterialPage = () => {
  const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [loading, setLoading] = useState(false);
  const [isUpdateDialog, setIsUpdateDialog] = useState(false);
  const [isManageCategoryDialog, setIsManageCategoryDialog] = useState(false);



  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const supplier_id = useRef('')

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // const { docs: res } = await getSupplierBy();
      // setSuppliers(res);
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
        await deleteSupplierBy({ supplier_id: supplierId });
        Swal.fire("ลบแล้ว!", "ข้อมูลผู้จัดจำหน่ายถูกลบเรียบร้อยแล้ว", "success");
        await fetchData();
      } catch (error) {
        console.error("Error deleting supplier:", error);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between  mb-4">
        <span className="text-xl font-[400]">จัดการข้อมูลวัสดุ</span>
        <div className="flex gap-2">
          <Button variant="contained" color="primary" onClick={() => setIsManageCategoryDialog(true)} startIcon={<Add />}>
            เพิ่มประเภทวัสดุ
          </Button>
          <Button variant="contained" color="primary" onClick={() => setIsUpdateDialog(true)} startIcon={<Edit />}>
            แก้ไขวัสดุ
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
                  <TableCell padding="checkbox" align="center"><Checkbox /></TableCell>
                  <TableCell align="center">ประเภท</TableCell>
                  <TableCell align="center">ชื่อวัสดุ</TableCell>
                  <TableCell align="center">รูปภาพ</TableCell>
                  <TableCell align="center">ราคา</TableCell>
                  <TableCell align="center">จำนวน</TableCell>
                  <TableCell align="center">หน่วย</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((supplier) => (
                  <TableRow key={supplier.supplier_id} hover>
                    <TableCell>{supplier.supplier_id}</TableCell>
                    <TableCell>{supplier.supplier_name}</TableCell>
                    <TableCell>{supplier.supplier_name}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<ModeEdit />}
                          onClick={() => {
                            setIsUpdateDialogOpen(true);
                            supplier_id.current = supplier.supplier_id;
                          }}
                        >
                          แก้ไข
                        </Button>
                        <Button variant="contained" color="error" startIcon={<Delete />} onClick={() => onDelete(supplier.supplier_id)}>
                          ลบ
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={suppliers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Paper>
      )}

      <UpdateMaterial open={isUpdateDialog} onClose={async () => { setIsUpdateDialog(false); await fetchData(); }} />
      <ManageMaterialCategory open={isManageCategoryDialog} onRefresh={() => fetchData()} onClose={() => setIsManageCategoryDialog(false)} />

    </>
  );
};

export default MaterialPage;
