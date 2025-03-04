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
} from "@mui/material";
import axios from "axios";

interface Product {
    product_id: string;
    product_name: string;
    product_quantity: string;
    product_price: string;
    product_category_id: string | null;
    product_img: string | null;
}

const SalesPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await axios.post("http://localhost:5120/product/getProductBy", {
            ...(selectedCategory && { product_category_id: selectedCategory }),
          });
          setProducts(response.data.docs);
          
          // วิธีที่ง่ายกว่าในการสร้าง categories
          const uniqueCategories = Array.from(new Set(
            response.data.docs
              .map((product: Product) => product.product_category_id)
              .filter(Boolean) // กรองค่า null และ undefined ออก
          )) as string[];
          
          setCategories(uniqueCategories);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
        setLoading(false);
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
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
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
                            <Card className="h-full">
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={product.product_img?.split(',')[0] || '/placeholder-image.jpg'}
                                    alt={product.product_name}
                                    sx={{ height: 200, objectFit: 'cover' }}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {product.product_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        รหัสสินค้า: {product.product_id}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        จำนวนคงเหลือ: {product.product_quantity} ชิ้น
                                    </Typography>
                                    <Typography variant="h6" color="primary" className="mt-2">
                                        ราคา: {Number(product.product_price).toLocaleString()} บาท
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