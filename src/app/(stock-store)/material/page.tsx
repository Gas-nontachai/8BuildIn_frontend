"use client";
import { API_URL } from "@/utils/config"
import { useEffect, useState, useRef } from "react";
import { formatDate } from "@/utils/date-helper"
import { Delete, Add, Home, Gavel, Search, ModeEdit, MoreVert, Clear, ArrowDownward, ArrowUpward, Sort } from "@mui/icons-material";
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

import ManageMaterialCategory from "@/app/components/StockStore/Material/MaterialCategory/Manage";
import UpdateMaterial from "@/app/components/StockStore/Material/Update";
import Loading from "@/app/components/Loading";

import { useUnit, useMaterialCategory } from "@/hooks/hooks";
import { MaterialCategory, Unit } from '@/misc/types';


import useMaterial from "@/hooks/useMaterial";
import { Material } from '@/misc/types';

const { getMaterialCategoryBy } = useMaterialCategory();
const { getMaterialBy, deleteMaterialBy } = useMaterial()
const { getUnitBy } = useUnit()

const MaterialPage = () => {
  const { page, setPage, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [loading, setLoading] = useState(false);
  const [isManageCategoryDialog, setIsManageCategoryDialog] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterialCategory, setSelectedMaterialCategory] = useState<string>("");
  const [unit, setUnit] = useState<Unit[]>([]);
  const [materialCategory, setMaterialCategory] = useState<MaterialCategory[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<Material | null>(null);
  const [isUpdateDialog, setIsUpdateDialog] = useState(false);
  const material_id = useRef("");
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<{ name: string; order: "ASC" | "DESC" }>({
    name: "adddate",
    order: "DESC",
  });

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>, material: Material) => {
    setAnchorEl(event.currentTarget);
    setSelected(material);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelected(null);
  };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const { docs } = await getMaterialBy({
        search: {
          text: search,
          columns: ["material_name"],
          condition: "LIKE",
        },
        match: selectedMaterialCategory ? { material_category_id: selectedMaterialCategory } : {},
        sorter: [{ key: sort.name, order: sort.order }],
      });
      setPage(0)
      setMaterials(docs);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }

  };

  const fetchMaterialCategory = async () => {
    setLoading(true);
    try {
      const { docs } = await getMaterialCategoryBy(
        selectedMaterialCategory ? { material_category_id: selectedMaterialCategory } : {}
      );
      setMaterialCategory(docs);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUnit();
    fetchMaterials();
    fetchMaterialCategory();
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [selectedMaterialCategory, sort]);

  const fetchUnit = async () => {
    const { docs: res_unit } = await getUnitBy();
    setUnit(res_unit);
  };

  const toggleSort = (key: "name" | "order", value: string) => {
    setSort((prevSort) => {
      if (prevSort.name === value) {
        return {
          ...prevSort,
          order: prevSort.order === "ASC" ? "DESC" : "ASC",
        };
      } else {
        return {
          name: value,
          order: "ASC",
        };
      }
    });
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setSortAnchorEl(null);
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
              <InputAdornment position="start" onClick={fetchMaterials} className="cursor-pointer">
                <Search />
              </InputAdornment>
            ),
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchMaterials();
            }
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <Autocomplete
            size="small"
            options={materialCategory}
            getOptionLabel={(option) => option.material_category_name}
            value={materialCategory.find(item => item.material_category_id === selectedMaterialCategory) || null}
            onChange={(event, newValue) => setSelectedMaterialCategory(newValue?.material_category_id || "")}
            renderInput={(params) => <TextField {...params} label="ค้นหาโดยประเภทสินค้า" />}
          />
        </FormControl>
        {
          (search || selectedMaterialCategory) && (
            <button
              className="bg-gray-200 p-2 rounded-md text-sm text-gray-700 flex items-center"
              onClick={() => {
                setSearch('');
                setSelectedMaterialCategory('');
              }}
            >
              <Clear />
            </button>
          )
        }
        <div className="flex gap-2">
          <Button
            className="bg-gray-200 p-2 rounded-md text-sm text-gray-700 flex items-center gap-1"
            onClick={openMenu}
            endIcon={<Sort />}
          >
            Sort
          </Button>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={closeMenu}
          >
            <MenuItem onClick={() => toggleSort("name", "adddate")}>
              จัดเรียงตามวันที่
              {sort.name === "adddate" && (sort.order === "ASC" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
            </MenuItem>
            <MenuItem onClick={() => toggleSort("name", "material_price")}>
              จัดเรียงตามราคา
              {sort.name === "material_price" && (sort.order === "ASC" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
            </MenuItem>
            <MenuItem onClick={() => toggleSort("name", "material_name")}>
              จัดเรียงตามชื่อสินค้า
              {sort.name === "material_name" && (sort.order === "ASC" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
            </MenuItem>
          </Menu>
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
                  <TableCell padding="checkbox" align="center">#</TableCell>
                  <TableCell align="center">รูปภาพ</TableCell>
                  <TableCell align="center">ชื่อวัสดุ</TableCell>
                  <TableCell align="center">ประเภท</TableCell>
                  <TableCell align="center">ราคาต่อชิ้น</TableCell>
                  <TableCell align="center">จำนวนที่มีในสต็อก</TableCell>
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
                          alt="Material"
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      </div>
                    </TableCell>
                    <TableCell align="center">{material.material_name}</TableCell>
                    <TableCell align="center">
                      {materialCategory.find((mt) => mt.material_category_id === material.material_category_id)?.material_category_name || 'ประเภท'}
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
