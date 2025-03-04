"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import {
    Typography,
    Card,
    CardContent,
    Box,
    CircularProgress,
    Grid,
} from "@mui/material";
import { useProduct } from "@/hooks/hooks";
import { Product } from "@/misc/types"
import { formatDate } from "@/utils/date-helper"
import { decimalFix } from "@/utils/number-helper"
import { API_URL } from "@/utils/config";

const ProductDetails = () => {
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { getProductByID } = useProduct();

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    const fetchProductDetails = async () => {
        if (!productId) return;

        try {
            const response = await getProductByID({
                product_id: productId
            });
            setProduct(response);
        } catch (error) {
            console.error("Error fetching product details:", error);
        } finally {
            setLoading(false);
        }
    };

    const getGridClass = (total: number) => {
        switch (total) {
            case 1:
                return 'grid-cols-1';
            case 2:
                return 'grid-cols-2';
            case 3:
                return 'grid-cols-3';
            case 4:
                return 'grid-cols-2 grid-rows-2';
            default:
                return 'grid-cols-3';
        }
    };


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!product) {
        return (
            <Box p={4}>
                <Typography variant="h6">ไม่พบข้อมูลสินค้า</Typography>
            </Box>
        );
    }

    const renderProductImages = (productImg: string | null) => {
        if (!productImg) {
            return (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">ไม่มีรูปภาพ</span>
                </div>
            );
        }
    
        const images = productImg.split(",");
        const totalImages = images.length;
        const displayImages = totalImages <= 5 ? images : images.slice(0, 5);
    
        return (
            <div className={`grid ${getGridClass(totalImages)} gap-0.5`}>
                {displayImages.map((img, index) => (
                    <div key={index} className="relative">
                        <img
                            src={`${API_URL}${img}`}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        {totalImages > 5 && index === 4 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white text-lg font-medium">
                                    +{totalImages - 5}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Box p={4}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        รายละเอียดสินค้า
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            {/* ข้อมูลสินค้าอยู่ทางซ้าย */}
                            <Typography variant="h6">
                                {product.product_name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                รหัสสินค้า: {product.product_id}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                จำนวนคงเหลือ: {product.product_quantity} ชิ้น
                            </Typography>
                            <Typography variant="h6" color="primary" className="mt-2">
                                ราคา: {decimalFix(product.product_price)} บาท
                            </Typography>
                            <Box mt={2}>
                                <Typography variant="body2" color="text.secondary">
                                    เพิ่มโดย: {product.addby}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    วันที่เพิ่ม: {formatDate(product.adddate)}
                                </Typography>
                                {product.updateby && (
                                    <>
                                        <Typography variant="body2" color="text.secondary">
                                            แก้ไขโดย: {product.updateby}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            วันที่แก้ไข: {new Date(product.lastupdate!).toLocaleDateString('th-TH')}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {/* รูปภาพอยู่ทางขวา */}
                            {renderProductImages(product.product_img)}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ProductDetails;