"use client";
import { useEffect, useState } from "react";
import { Delete, Add } from "@mui/icons-material";
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, CircularProgress, Checkbox } from "@mui/material";
import { usePagination } from "@/context/PaginationContext";
import { decimalFix } from "@/utils/number-helper"

import ManageMaterialCategory from "@/app/components/MaterialCategory/Manage";

import useMaterial from "@/hooks/useMaterial";
import { Material } from '@/misc/types';

const MaterialPage = () => {
  const { getMaterialBy } = useMaterial()
  const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [loading, setLoading] = useState(false);
  const [isManageCategoryDialog, setIsManageCategoryDialog] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { docs: res } = await getMaterialBy();
      setMaterials(res);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
    setLoading(false);
  };

  const onDelete = async (materialId: string) => {
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
      <div className="flex justify-between  mb-4">
        <span className="text-xl font-[400]">จัดการข้อมูลวัสดุ</span>
        <div className="flex gap-2">
          <Button variant="contained" color="primary" onClick={() => setIsManageCategoryDialog(true)} startIcon={<Add />}>
            เพิ่มประเภทวัสดุ
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
                  <TableCell align="center">จัดการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((material, index) => (
                  <TableRow key={material.material_id} hover>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{material.material_category_id}</TableCell>
                    <TableCell align="center">{material.material_name}</TableCell>
                    <TableCell align="center">{material.material_img}</TableCell>
                    <TableCell align="center">{decimalFix(material.material_price)} ฿ / {material.unit_id || 'ชิ้น'}</TableCell>
                    <TableCell align="center">{material.material_quantity} {material.unit_id || 'ชิ้น'} </TableCell>
                    <TableCell align="center">
                      <div className="flex justify-center gap-2">
                        <Button variant="text" color="error" startIcon={<Delete />} onClick={() => onDelete(material.material_id)} />
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
            count={materials.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Paper>
      )}

      <ManageMaterialCategory open={isManageCategoryDialog} onRefresh={() => fetchData()} onClose={() => setIsManageCategoryDialog(false)} />
    </>
  );
};

export default MaterialPage;
