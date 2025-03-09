"use client"
import React, { useState, useEffect } from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Paper,
    TableContainer,
    CircularProgress,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { useProduct } from "@/hooks/hooks";
import { Product } from "@/misc/types";

const ProductTableData: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { getProductBy } = useProduct();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getProductBy({});
            setProducts(response.docs);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[400px]">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="w-full p-4">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow className="bg-gray-100">
                            <TableCell>รหัสสินค้า</TableCell>
                            <TableCell>ชื่อสินค้า</TableCell>
                            <TableCell>หมวดหมู่</TableCell>
                            <TableCell>จำนวน</TableCell>
                            <TableCell>ราคา</TableCell>
                            <TableCell>วัตถุดิบ</TableCell>
                            <TableCell>วันที่เพิ่ม</TableCell>
                            <TableCell>วันที่อัพเดท</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.product_id}>
                                <TableCell>{product.product_id}</TableCell>
                                <TableCell>{product.product_name}</TableCell>
                                <TableCell>{product.product_category_id}</TableCell>
                                <TableCell>{product.product_quantity}</TableCell>
                                <TableCell>{product.product_price}</TableCell>
                                <TableCell>{product.material}</TableCell>
                                <TableCell>
                                    {product.adddate ? new Date(product.adddate).toLocaleDateString('th-TH') : '-'}
                                </TableCell>
                                <TableCell>
                                    {product.lastupdate ? new Date(product.lastupdate).toLocaleDateString('th-TH') : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ProductTableData;