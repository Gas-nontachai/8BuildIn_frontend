"use client";
import { useEffect, useState } from "react";
import { Delete, Add } from "@mui/icons-material";
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, CircularProgress, Checkbox } from "@mui/material";
import { usePagination } from "@/context/PaginationContext";
import { decimalFix } from "@/utils/number-helper"
import ManageProductCategory from "@/app/components/ProductCategory/Manage";

import useProduct from "@/hooks/useProduct";
import { Product } from '@/misc/types';

const ProductPage = () => {
  const { getProductBy } = useProduct()
  const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [loading, setLoading] = useState(false);
  const [isManageCategoryDialog, setIsManageCategoryDialog] = useState(false);
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { docs: res } = await getProductBy();
      console.log(res);

      setProducts(res);
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
        Swal.fire("ลบแล้ว!", "ข้อมูลผู้จัดจำหน่ายถูกลบเรียบร้อยแล้ว", "success");
        await fetchData();
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
                    <TableCell align="center">{product.product_category_id}</TableCell>
                    <TableCell align="center">{product.product_name}</TableCell>
                    <TableCell align="center">{product.product_img}</TableCell>
                    <TableCell align="center">{decimalFix(product.product_price)} ฿ / {product.unit_id || 'ชิ้น'}</TableCell>
                    <TableCell align="center">{product.product_quantity} {product.unit_id || 'ชิ้น'} </TableCell>
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
    </>
  );
};

export default ProductPage;
