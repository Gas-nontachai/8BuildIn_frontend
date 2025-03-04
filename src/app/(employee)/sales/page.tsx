"use client";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Box,
    IconButton,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "@/utils/config"
import { decimalFix } from "@/utils/number-helper"
import { useRouter } from 'next/navigation';
import {useProduct} from "@/hooks/hooks";
import { Product } from "@/misc/types"

const SalesPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([]);
    const router = useRouter();
    const { getProductBy } = useProduct();

    useEffect(() => {
        fetchProducts();
        fetData()
    }, [selectedCategory]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { docs } = await getProductBy(
                selectedCategory ? { product_category_id: selectedCategory } : {}
            );
            setProducts(docs);

            const uniqueProducts = docs.map((product: Product) => product.product_name);
            setCategories(Array.from(new Set(uniqueProducts)));
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    };

    const fetData = async () => {
        const {docs: res} = await getProductBy()
        console.log(res);
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

        // ฟังก์ชันสำหรับกำหนด class ของ grid ตามจำนวนรูป
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

        // ฟังก์ชันสำหรับกำหนดจำนวนรูปที่จะแสดง
        const getDisplayImages = () => {
            if (totalImages <= 5) {
                return images;
            }
            // ถ้ามีรูปมากกว่า 5 รูป จะแสดงแค่ 5 รูปแรก
            return images.slice(0, 5);
        };

        const displayImages = getDisplayImages();

        return (
            <div className={`h-48 grid ${getGridClass(totalImages)} gap-0.5`}>
                {displayImages.map((img, index) => (
                    <div
                        key={index}
                        className={`relative ${totalImages > 5 && index === 4 ? 'last-image' : ''
                            }`}
                    >
                        <img
                            src={`${API_URL}${img}`}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        {/* แสดงจำนวนรูปที่เหลือถ้ามีรูปมากกว่า 5 รูป */}
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

    const handleViewDetails = (productId: string) => {
        router.push(`/sales/product-details?id=${productId}`);
    };


    return (

        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <Typography variant="h5" component="h1">
                    สินค้าทั้งหมด
                </Typography>

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>ประเภทสินค้า</InputLabel>
                    <Select
                        value={selectedCategory}
                        label="ประเภทสินค้า"
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <MenuItem value="">ทั้งหมด</MenuItem>
                        {categories.map((productName) => (
                            <MenuItem key={productName} value={productName}>
                                {productName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            {loading ? (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
                            <Card className="flex flex-col h-full">
                                {renderProductImages(product.product_img)}
                                <CardContent className="flex-grow">
                                    <div className="flex justify-between">
                                        <Typography gutterBottom variant="h6" component="div">
                                            {product.product_name}
                                        </Typography>
                                        <IconButton
                                            onClick={() => handleViewDetails(product.product_id)}
                                            className="hover:bg-gray-100"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M17.4 17h-1.8a1.6 1.6 0 0 1-1.6-1.6v-3.8a1.6 1.6 0 0 1 1.6-1.6h1.8a1.6 1.6 0 0 1 1.6 1.6v3.8a1.6 1.6 0 0 1-1.6 1.6m-9 0H6.6A1.6 1.6 0 0 1 5 15.4V3.6A1.6 1.6 0 0 1 6.6 2h1.8A1.6 1.6 0 0 1 10 3.6v11.8A1.6 1.6 0 0 1 8.4 17" />
                                                <path fill="currentColor" fillRule="evenodd" d="M1 21a1 1 0 0 0 1 1h20a1 1 0 1 0 0-2H2a1 1 0 0 0-1 1" clipRule="evenodd" />
                                            </svg>
                                        </IconButton>      </div>
                                    <Typography variant="body2" color="text.secondary">
                                        รหัสสินค้า: {product.product_id}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        จำนวนคงเหลือ: {product.product_quantity} ชิ้น
                                    </Typography>
                                    <Typography variant="h6" color="primary" className="mt-2">
                                        ราคา: {decimalFix(product.product_price)} บาท
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>


            )}

        </div>


    );
};

export default SalesPage;