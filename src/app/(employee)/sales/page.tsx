"use client";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Grid,
    FormControl,
    Button,
    Autocomplete,
    Breadcrumbs,
    Box,
    Stack,
    Link,
    IconButton,
    TextField,
    InputAdornment
} from "@mui/material";
import { Home, Store, Search, AddShoppingCart } from "@mui/icons-material";
import { API_URL } from "@/utils/config"
import { decimalFix } from "@/utils/number-helper"
import { useRouter } from 'next/navigation';
import { useProduct, useCart } from "@/hooks/hooks";
import { Product, Cart } from "@/misc/types"
import { useCartContext } from "@/context/CartContext";
import Loading from "@/app/components/Loading";

const SalesPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([]);
    const router = useRouter();
    const { getProductBy } = useProduct();
    const { insertCart } = useCart();
    const { refreshCart } = useCartContext();


    useEffect(() => {
        fetchProducts();
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

    const addToCart = async (product_id: string) => {
        try {
            await insertCart({
                cart_id: "",
                cart_amount: "1",
                cart_status: "0",
                product_id: product_id,
            });
            await refreshCart(); 
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert('เกิดข้อผิดพลาดในการเพิ่มสินค้าลงตะกร้า');
        }
    };


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
        <>
            <div className="flex justify-start items-center mb-2">
                <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
                    <Link underline="hover" href="/">
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
                            <Home fontSize="small" />
                            <Typography variant="body1" color="primary">หน้าหลัก</Typography>
                        </Stack>
                    </Link>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Store fontSize="small" />
                        <Typography variant="body1" color="text.secondary">สินค้าทั้งหมด</Typography>
                    </Stack>
                </Breadcrumbs>
            </div>
            <div className="flex gap-2 mb-5">
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="ค้นหาชื่อสินค้า..."
                    className="w-64"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl sx={{ minWidth: 200 }}>
                    <Autocomplete
                        value={selectedCategory}
                        onChange={(event, newValue) => setSelectedCategory(newValue)}
                        options={categories}
                        renderInput={(params) => <TextField {...params} label="ค้นหาตามประเภทสินค้า" size="small" />}
                        isOptionEqualToValue={(option, value) => option === value}
                        disableClearable
                    />
                </FormControl>
            </div>
            {loading ? (
                <Loading />
            ) : (
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
                            <Card className="flex flex-col h-full shadow-lg rounded-lg overflow-hidden">
                                {renderProductImages(product.product_img)}
                                <CardContent className="flex-grow p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <Typography gutterBottom variant="h6" component="div" className="font-semibold text-lg">
                                            {product.product_name}
                                        </Typography>
                                        <IconButton
                                            onClick={() => handleViewDetails(product.product_id)}
                                            className="hover:bg-gray-200 rounded-full p-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M17.4 17h-1.8a1.6 1.6 0 0 1-1.6-1.6v-3.8a1.6 1.6 0 0 1 1.6-1.6h1.8a1.6 1.6 0 0 1 1.6 1.6v3.8a1.6 1.6 0 0 1-1.6 1.6m-9 0H6.6A1.6 1.6 0 0 1 5 15.4V3.6A1.6 1.6 0 0 1 6.6 2h1.8A1.6 1.6 0 0 1 10 3.6v11.8A1.6 1.6 0 0 1 8.4 17" />
                                                <path fill="currentColor" fillRule="evenodd" d="M1 21a1 1 0 0 0 1 1h20a1 1 0 1 0 0-2H2a1 1 0 0 0-1 1" clipRule="evenodd" />
                                            </svg>
                                        </IconButton>
                                    </div>
                                    <Typography variant="body2" color="text.secondary" className="mb-2">
                                        รหัสสินค้า: <span className="font-medium">{product.product_id}</span>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" className="mb-2">
                                        จำนวนคงเหลือ: <span className="font-medium">{product.product_quantity} ชิ้น</span>
                                    </Typography>
                                    <Typography variant="body1" color="error" className="mt-3 font-semibold">
                                        ฿ {decimalFix(product.product_price)}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ display: 'flex', justifyContent: 'end' }}>
                                    <button className="text-[15px] px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-2xl text-white font-[500]" onClick={() => addToCart(product.product_id)}>
                                        <AddShoppingCart /> เพิ่มลงตะกร้า
                                    </button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
};

export default SalesPage;