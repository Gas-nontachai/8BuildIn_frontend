"use client";
import { API_URL } from "@/utils/config"
import { useEffect, useMemo, useState } from "react";
import Swal from 'sweetalert2';
import { Delete, Add, Home, Gavel, Search } from "@mui/icons-material";
import {
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Breadcrumbs, Checkbox, Typography, Stack, Link,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
  InputAdornment,
  TextField,
  List,
  ListItem,
} from "@mui/material";
import { usePagination } from "@/context/PaginationContext";
import { decimalFix } from "@/utils/number-helper"

import ManageMaterialCategory from "@/app/components/MaterialCategory/Manage";
import Loading from "@/app/components/Loading";

import { useUnit } from "@/hooks/hooks";
import { Unit } from '@/misc/types';

const { getMaterialBy } = useMaterial()
const { getUnitBy } = useUnit()

import useMaterial from "@/hooks/useMaterial";
import useMaterialCategory from "@/hooks/useMaterialCategory";
import { Material, MaterialCategory } from '@/misc/types';
const MaterialPage = () => {
  const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [loading, setLoading] = useState(false);
  const [isManageCategoryDialog, setIsManageCategoryDialog] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [unit, setUnit] = useState<Unit[]>([]);
  const [materialCategory, setMaterialCategory] = useState<MaterialCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { getMaterialCategoryBy } = useMaterialCategory();

  const filterNameMaterial = useMemo(() => {
    return materials.filter((item) =>
      item.material_name?.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [materials, searchTerm]);

  const filterMaterialCategory = useMemo(() => {
    return materialCategory.filter((item) =>
      item.material_category_name?.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [materialCategory, searchTerm]);

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
      const [materialsRes, categoriesRes] = await Promise.all([
        getMaterialBy(),
        getMaterialCategoryBy(),
      ]);

      setMaterials(materialsRes.docs);
      setMaterialCategory(categoriesRes.docs);
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

      <div className="flex gap-2 mb-5">
        <Autocomplete
          className="w-64"
          options={filterNameMaterial}
          getOptionLabel={(option) => option.material_name ?? "ไม่มีชื่อ"}
          noOptionsText="ไม่มีวัสดุ"
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size="small"
              placeholder="ค้นหาชื่อวัสดุ..."
              className="w-64"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <Autocomplete
            options={filterMaterialCategory}
            getOptionLabel={(option) => option.material_category_name ?? "ไม่มีชื่อ"}
            renderInput={(params) => (
              <TextField {...params} label="ค้นหาตามประเภทวัสดุ" size="small" />
            )}
            isOptionEqualToValue={(option, value) => option.material_category_name === value?.material_category_name} // Correct comparison
            disableClearable
            noOptionsText="ไม่มีประเภทวัสดุ"
          />
        </FormControl>
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
