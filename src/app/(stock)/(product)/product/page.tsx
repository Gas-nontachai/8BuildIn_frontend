"use client";
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { MoreVert, Store, Delete, Add, Home, Edit, Visibility, Search, ArrowUpward, ArrowDownward, Clear, Sort } from "@mui/icons-material";
import {
  MenuItem,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Breadcrumbs,
  Checkbox,
  Typography,
  Stack,
  Link,
  IconButton,
  TextField,
  InputAdornment,
  Autocomplete,
  FormControl
} from "@mui/material";
import { usePagination } from "@/context/PaginationContext";
import { decimalFix } from "@/utils/number-helper"
import ManageProductCategory from "@/app/components/ProductCategory/Manage";
import AddProduct from "@/app/components/Product/Add";
import UpdateProduct from "@/app/components/Product/Update";

import Loading from "@/app/components/Loading";

import { useProduct, useUnit, useProductCategory } from "@/hooks/hooks";
import { Product, Unit, ProductCategory } from '@/misc/types';
import { API_URL } from "@/utils/config"

const ProductPage = () => {

  const [selectedProductId, setSelectedProductId] = useState('');
  const [sortAnchorEl, setSortAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { getProductBy, deleteProductBy } = useProduct()
  const { getUnitBy } = useUnit()
  const { getProductCategoryBy } = useProductCategory()
  const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [loading, setLoading] = useState(false);
  const [isManageCategoryDialog, setIsManageCategoryDialog] = useState(false);
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [updateProductDialog, setUpdateProductDialog] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [unit, setUnit] = useState<Unit[]>([]);
  const [productCategory, setProductCategory] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<{ name: string; order: "ASC" | "DESC" }>({
    name: "adddate",
    order: "DESC",
  });

  useEffect(() => {
    fetchProducts()
    fetchData();
  }, []);

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { docs } = await getProductBy({
        search: {
          text: search,
          columns: ["product_name"],
          condition: "LIKE",
        },
        match: selectedCategory ? { product_category_id: selectedCategory } : {},
        sorter: [{ key: sort.name, order: sort.order }],
      });
      setProducts(docs);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { docs: res_unit } = await getUnitBy();
      setUnit(res_unit);
      const { docs: res_prod_cat } = await getProductCategoryBy();
      setProductCategory(res_prod_cat);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  const handleClick = (event: any, productId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedProductId(productId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedProductId('');
  };
  const onDelete = async (productId: string) => {
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
        Swal.fire({
          title: 'กำลังลบข้อมูล...',
          text: 'กรุณารอสักครู่',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        await deleteProductBy({ product_id: productId })
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
        }); await fetchData();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setSortAnchorEl(null);
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
            <Store fontSize="small" />
            <Typography variant="body1" color="text.secondary">ข้อมูลสินค้า</Typography>
          </Stack>
        </Breadcrumbs>
        <div className="flex gap-2">
          <Button variant="contained" color="primary" onClick={() => setIsManageCategoryDialog(true)} startIcon={<Add />}>
            เพิ่มประเภทสินค้า
          </Button>
          <Button variant="contained" color="primary" onClick={() => setAddProductDialog(true)} startIcon={<Add />}>
            เพิ่มสินค้า
          </Button>
        </div>
      </div>
      <div className="flex gap-2 mb-5">
        <TextField
          variant="outlined"
          size="small"
          placeholder="ค้นหาชื่อสินค้า..."
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" onClick={fetchProducts} className="cursor-pointer">
                <Search />
              </InputAdornment>
            ),
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchProducts();
            }
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <Autocomplete
            size="small"
            options={productCategory}
            getOptionLabel={(option) => option.product_category_name}
            value={productCategory.find(item => item.product_category_id === selectedCategory) || null}
            onChange={(event, newValue) => setSelectedCategory(newValue?.product_category_id || "")}
            renderInput={(params) => <TextField {...params} label="ค้นหาโดยประเภทสินค้า" />}
          />
        </FormControl>
        {
          (search || selectedCategory) && (
            <button
              className="bg-gray-200 p-2 rounded-md text-sm text-gray-700 flex items-center"
              onClick={() => {
                setSearch('');
                setSelectedCategory('');
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
            <MenuItem onClick={() => toggleSort("name", "product_price")}>
              จัดเรียงตามราคา
              {sort.name === "product_price" && (sort.order === "ASC" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
            </MenuItem>
            <MenuItem onClick={() => toggleSort("name", "product_name")}>
              จัดเรียงตามชื่อสินค้า
              {sort.name === "product_name" && (sort.order === "ASC" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
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
                  <TableCell padding="checkbox" align="center"><Checkbox /></TableCell>
                  <TableCell align="center">ประเภท</TableCell>
                  <TableCell align="center">รหัสสินค้า</TableCell>
                  <TableCell align="center">ชื่อสินค้า</TableCell>
                  <TableCell align="center">รูปภาพ</TableCell>
                  <TableCell align="center">ราคา</TableCell>
                  <TableCell align="center">จำนวน</TableCell>
                  <TableCell align="center">จัดการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product, index) => (
                  <TableRow key={product.product_id} hover>
                    <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="center">{productCategory.find((s) => s.product_category_id === product.product_category_id)?.product_category_name || 'ไม่ทราบประเภท'}</TableCell>
                    <TableCell align="center">{product.product_id}</TableCell>
                    <TableCell align="center">{product.product_name}</TableCell>
                    <TableCell align="center">
                      <img
                        src={product.product_img ? `${API_URL}${product.product_img.split(",")[0]}` : "/default-cart.png"}
                        alt="Product"
                        style={{ width: "50px", height: "50px", margin: "5px" }}
                      />
                    </TableCell>
                    <TableCell align="center">{decimalFix(product.product_price)} ฿ / {unit.find((s) => s.unit_id === product.unit_id)?.unit_name_th || 'ชิ้น'}</TableCell>
                    <TableCell align="center">{product.product_quantity} {unit.find((s) => s.unit_id === product.unit_id)?.unit_name_th || 'ชิ้น'} </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="inherit"
                        id={`menu-button-${product.product_id}`}
                        aria-controls={anchorEl?.id === `menu-button-${product.product_id}` ? 'demo-positioned-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={anchorEl?.id === `menu-button-${product.product_id}` ? 'true' : undefined}
                        onClick={(event) => handleClick(event, product.product_id)}
                        sx={{ fontSize: 24 }}
                      >
                        <MoreVert fontSize="inherit" />
                      </IconButton>
                      <Menu
                        id="demo-positioned-menu"
                        aria-labelledby={`menu-button-${product.product_id}`}
                        anchorEl={anchorEl?.id === `menu-button-${product.product_id}` ? anchorEl : null}
                        open={anchorEl?.id === `menu-button-${product.product_id}`}
                        onClose={handleClose}
                      >
                        <MenuItem sx={{ padding: '4px 8px' }}>
                          <Button startIcon={<Visibility />} onClick={() => { }} size="small">
                            View
                          </Button>
                        </MenuItem>
                        <MenuItem sx={{ padding: '4px 8px' }}>
                          <Button startIcon={<Edit />} onClick={() => setUpdateProductDialog(true)} size="small">
                            Edit
                          </Button>
                        </MenuItem>
                        {!product.stock_in_id && (
                          <MenuItem sx={{ padding: '4px 8px' }}>
                            <Button startIcon={<Delete />} onClick={() => onDelete(product.product_id)} size="small">
                              Delete
                            </Button>
                          </MenuItem>
                        )}
                      </Menu>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </>
      )
      }

      <ManageProductCategory open={isManageCategoryDialog} onRefresh={() => fetchData()} onClose={() => setIsManageCategoryDialog(false)} />
      <AddProduct open={addProductDialog} onRefresh={() => fetchData()} onClose={() => setAddProductDialog(false)} />
      <UpdateProduct open={updateProductDialog} product_id={selectedProductId} onRefresh={() => fetchData()} onClose={() => { setUpdateProductDialog(false); handleClose(); }} />
    </>
  );
};

export default ProductPage;
