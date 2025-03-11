"use client";
import { API_URL } from "@/utils/config"
import { useEffect, useState, useRef } from "react";
import { formatDate } from "@/utils/date-helper"
import { Delete, Add, Home, Gavel, Search, ModeEdit, MoreVert } from "@mui/icons-material";
import {
  Table, TableBody, TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Breadcrumbs,
  Typography,
  Stack,
  Link,
  FormControl,
  Autocomplete,
  InputAdornment,
  TextField,
  MenuItem,
  IconButton,
  Menu
} from "@mui/material";
import { usePagination } from "@/context/PaginationContext";
import { decimalFix } from "@/utils/number-helper"

import ManageMaterialCategory from "@/app/components/MaterialCategory/Manage";
import UpdateMaterial from "@/app/components/Material/Update";
import Loading from "@/app/components/Loading";

import { useUnit, useMaterialCategory } from "@/hooks/hooks";
import { Unit } from '@/misc/types';


import useMaterial from "@/hooks/useMaterial";
import { Material } from '@/misc/types';

const { getMaterialCategoryBy } = useMaterialCategory();
const { getMaterialBy, deleteMaterialBy } = useMaterial()
const { getUnitBy } = useUnit()

const MaterialPage = () => {
  const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [loading, setLoading] = useState(false);
  const [isManageCategoryDialog, setIsManageCategoryDialog] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterialCategory] = useState<string>("");
  const [unit, setUnit] = useState<Unit[]>([]);
  const [materialCategory, setMaterialCategory] = useState<{ material_category_name: string, value: string }[]>([]);
  const [search, setSearch] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<Material | null>(null);
  const [isUpdateDialog, setIsUpdateDialog] = useState(false);
  const material_id = useRef("");

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>, material: Material) => {
    setAnchorEl(event.currentTarget);
    setSelected(material);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelected(null);
  };


  const [sort, setSort] = useState<{ name: string; order: "ASC" | "DESC" }>({
    name: "adddate",
    order: "DESC",
  });

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const { docs } = await getMaterialBy({
        search: {
          text: search,
          columns: ["material_name"],
          condition: "LIKE",
        },
        match: selectedMaterial ? { material_category_id: selectedMaterial } : {},
        sorter: [{ key: sort.name, order: sort.order }],
      });
      setMaterials(docs);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  const fetchMaterialCategory = async () => {
    setLoading(true);
    try {
      const { docs } = await getMaterialCategoryBy(
        selectedMaterial ? { material_category_id: selectedMaterial } : {}
      );
      setMaterialCategory(docs.map(item => ({ material_category_name: item.material_category_name, value: item.material_category_id })));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    try {
      setLoading(true);
      fetchUnit();
      fetchMaterials();
      fetchMaterialCategory();
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      setLoading(true);
      fetchMaterials();
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMaterial]);

  const fetchUnit = async () => {
    try {
      const { docs: res_unit } = await getUnitBy();
      setUnit(res_unit);
    } catch (error) {
      console.error("Error fetching materials:", error);
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
          <Button variant="contained" color="success" onClick={() => setIsManageCategoryDialog(true)} startIcon={<Add />}>
            เพิ่มประเภทวัสดุ
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        <TextField
          variant="outlined"
          size="small"
          placeholder="ค้นหาชื่อวัสดุ..."
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
                onClick={fetchMaterials}
                className="cursor-pointer"
              >
                <Search />
              </InputAdornment>
            ),
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchMaterials();
            }
          }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <Autocomplete
            size="small"
            options={materialCategory}
            getOptionLabel={(option) => option.material_category_name}
            value={materialCategory.find(item => item.value === selectedMaterial) || null}
            onChange={(event, newValue) => setSelectedMaterialCategory(newValue?.value || "")}
            renderInput={(params) => <TextField {...params} label="ค้นหาโดยประเภทวัสดุ" />}
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
                  <TableCell padding="checkbox" align="center">#</TableCell>
                  <TableCell align="center">รูปภาพ</TableCell>
                  <TableCell align="center">ชื่อวัสดุ</TableCell>
                  <TableCell align="center">ประเภท</TableCell>
                  <TableCell align="center">ราคาต่อชิ้น</TableCell>
                  <TableCell align="center">จำนวนสต็อก</TableCell>
                  <TableCell align="center">วันเวลาที่รับสต็อก</TableCell>
                  <TableCell align="center">จัดการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((material, index) => (
                  <TableRow key={material.material_id} hover>
                    <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="center">
                      <div className="flex justify-center">
                        <img
                          src={material.material_img ? `${API_URL}${material.material_img.split(",")[0]}` : "/no-img.jpg"}
                          alt="Product"
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      </div>
                    </TableCell>
                    <TableCell align="center">{material.material_name}</TableCell>
                    <TableCell align="center">
                      {materialCategory.find((mt) => mt.value === material.material_category_id)?.material_category_name || 'ประเภท'}
                    </TableCell>
                    <TableCell align="center">
                      {decimalFix(material.material_price)} ฿ / {unit.find((s) => s.unit_id === material.unit_id)?.unit_name_th || 'ชิ้น'}
                    </TableCell>
                    <TableCell align="center">
                      {material.material_quantity} {unit.find((s) => s.unit_id === material.unit_id)?.unit_name_th || 'ชิ้น'}
                    </TableCell>
                    <TableCell align="center">{formatDate(material.adddate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                    <TableCell align="center">
                      <>
                        <IconButton
                          size="small"
                          onClick={(e) => handleClickMenu(e, material)}
                        >
                          <MoreVert />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleCloseMenu}
                        >
                          <MenuItem onClick={() => {
                            setIsUpdateDialog(true);
                            material_id.current = selected?.material_id!;
                            handleCloseMenu();
                          }}>
                            <ModeEdit className="mr-2" /> แก้ไข
                          </MenuItem>
                        </Menu>
                      </>
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
      )
      }

      <ManageMaterialCategory open={isManageCategoryDialog} onRefresh={() => fetchMaterials()} onClose={() => setIsManageCategoryDialog(false)} />
      <UpdateMaterial open={isUpdateDialog} material_id={material_id.current} onRefresh={() => fetchMaterials()} onClose={() => setIsUpdateDialog(false)} />
    </>
  );
};

export default MaterialPage;
