"use client";
import { useEffect, useState } from "react";
import { Delete, Add } from "@mui/icons-material";
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, CircularProgress, Checkbox } from "@mui/material";
import { usePagination } from "@/context/PaginationContext";
import { decimalFix } from "@/utils/number-helper"
import ManageProductCategory from "@/app/components/ProductCategory/Manage";
import AddProduct from "@/app/components/Product/Add";

import { useProduct, useUnit, useProductCategory } from "@/hooks/hooks";
import { Product, Unit, ProductCategory } from '@/misc/types';
import { API_URL } from "@/utils/config"
const ProductPage = () => {
  const { getProductBy, deleteProductBy } = useProduct()
  const { getUnitBy } = useUnit()
  const { getProductCategoryBy } = useProductCategory()
  const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [loading, setLoading] = useState(false);
  const [isManageCategoryDialog, setIsManageCategoryDialog] = useState(false);
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [unit, setUnit] = useState<Unit[]>([]);
  const [productCategory, setProductCategory] = useState<ProductCategory[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { docs: res_prod } = await getProductBy();
      setProducts(res_prod);
      const { docs: res_unit } = await getUnitBy();
      setUnit(res_unit);
      const { docs: res_prod_cat } = await getProductCategoryBy();
      setProductCategory(res_prod_cat);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
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

  return (
    <>
      <div className="flex justify-between  mb-4">
        <span className="text-xl font-[400]">จัดการข้อมูลสินค้า</span>
        <div className="flex gap-2">
          <Button variant="contained" color="primary" onClick={() => setIsManageCategoryDialog(true)} startIcon={<Add />}>
            เพิ่มประเภทสินค้า
          </Button>
          <Button variant="contained" color="primary" onClick={() => setAddProductDialog(true)} startIcon={<Add />}>
            เพิ่มสินค้า
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
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{productCategory.find((s) => s.product_category_id === product.product_category_id)?.product_category_name || 'ไม่ทราบประเภท'}</TableCell>
                    <TableCell align="center">{product.product_id}</TableCell>
                    <TableCell align="center">{product.product_name}</TableCell>
                    <TableCell align="center">
                      {product.product_img &&
                        product.product_img.split(",").map((img, index) => (
                          <img
                            key={index}
                            src={`${API_URL}${img}`}
                            alt={`Product ${index}`}
                            style={{ width: "50px", height: "50px", margin: "5px" }}
                          />
                        ))}
                    </TableCell>
                    <TableCell align="center">{decimalFix(product.product_price)} ฿ / {unit.find((s) => s.unit_id === product.unit_id)?.unit_name_th || 'ชิ้น'}</TableCell>
                    <TableCell align="center">{product.product_quantity} {unit.find((s) => s.unit_id === product.unit_id)?.unit_name_th || 'ชิ้น'} </TableCell>
                    <TableCell align="center">
                      <div className="flex justify-center gap-2">
                        <Button variant="text" color="error" startIcon={<Delete />} onClick={() => onDelete(product.product_id)} />
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
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Paper>
      )}

      <ManageProductCategory open={isManageCategoryDialog} onRefresh={() => fetchData()} onClose={() => setIsManageCategoryDialog(false)} />
      <AddProduct open={addProductDialog} onRefresh={() => fetchData()} onClose={() => setAddProductDialog(false)} />
    </>
  );
};

export default ProductPage;
