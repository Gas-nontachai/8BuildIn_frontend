"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/utils/config"
import Swal from 'sweetalert2';
import { Delete, Add, Home, Gavel } from "@mui/icons-material";
import {
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Breadcrumbs, Checkbox, Typography, Stack, Link,
} from "@mui/material";
import { usePagination } from "@/context/PaginationContext";
import { decimalFix } from "@/utils/number-helper"

import ManageMaterialCategory from "@/app/components/MaterialCategory/Manage";
import Loading from "@/app/components/Loading";

import { useMaterial, useUnit } from "@/hooks/hooks";
import { Material, Unit } from '@/misc/types';

const { getMaterialBy } = useMaterial()
const { getUnitBy } = useUnit()

const MaterialPage = () => {
  const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [loading, setLoading] = useState(false);
  const [isManageCategoryDialog, setIsManageCategoryDialog] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [unit, setUnit] = useState<Unit[]>([]);

  useEffect(() => {
    try {
      setLoading(true);
      fetchData();
      fetchUnit()
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      const { docs: res } = await getMaterialBy();
      setMaterials(res);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const fetchUnit = async () => {
    try {
      const { docs: res_unit } = await getUnitBy();
      setUnit(res_unit);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
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
      <div className="flex justify-between items-center mb-4">
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
          <Link underline="hover" href="/">
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
              <Home fontSize="small" />
              <Typography variant="body1" color="primary">หน้าหลัก</Typography>
            </Stack>
          </Link>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Gavel fontSize="small" />
            <Typography variant="body1" color="text.secondary">ข้อมูลวัสดุ</Typography>
          </Stack>
        </Breadcrumbs>
        <div className="flex gap-2">
          <Button variant="contained" color="primary" onClick={() => setIsManageCategoryDialog(true)} startIcon={<Add />}>
            เพิ่มประเภทวัสดุ
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
                    <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="center">{material.material_category_id || "ไม่ทราบประเภท"}</TableCell>
                    <TableCell align="center">{material.material_name}</TableCell>
                    <TableCell align="center">
                      <img
                        src={material.material_img ? `${API_URL}${material.material_img.split(",")[0]}` : "/default-cart.png"}
                        alt="Product"
                        style={{ width: "50px", height: "50px", margin: "5px" }}
                      />
                    </TableCell>
                    <TableCell align="center">{decimalFix(material.material_price)} ฿ / {unit.find((s) => s.unit_id === material.unit_id)?.unit_name_th || 'ชิ้น'}</TableCell>
                    <TableCell align="center">{material.material_quantity} {unit.find((s) => s.unit_id === material.unit_id)?.unit_name_th || 'ชิ้น'}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => onDelete(material.material_id)}>
                        ลบ
                      </Button>
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
        </>
      )}

      <ManageMaterialCategory open={isManageCategoryDialog} onRefresh={() => fetchData()} onClose={() => setIsManageCategoryDialog(false)} />
    </>
  );
};

export default MaterialPage;
