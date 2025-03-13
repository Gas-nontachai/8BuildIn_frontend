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
    Stack,
    Link,
    IconButton,
    TextField,
    InputAdornment,
    MenuItem,
    Menu,
    Box
} from "@mui/material";
import { Home, Store, Search, AddShoppingCart, Clear, Sort, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { API_URL } from "@/utils/config"
import { decimalFix } from "@/utils/number-helper"
import { useRouter } from 'next/navigation';
import { useProduct, useCart, useProductCategory, useUnit } from "@/hooks/hooks";
import { Product, Unit } from "@/misc/types"
import { useCartContext } from "@/context/CartContext";
import Loading from "@/app/components/Loading";

const { getProductBy } = useProduct();
const { insertCart } = useCart();
const { getProductCategoryBy } = useProductCategory();
const { getUnitBy } = useUnit();

const SalesPage = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [products, setProducts] = useState<Product[]>([]);
    const [unit, setUnit] = useState<Unit[]>([]);
    const [productCategory, setProductCategory] = useState<{ title: string, value: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const router = useRouter();
    const { refreshCart } = useCartContext();
    const [sort, setSort] = useState<{ name: string; order: "ASC" | "DESC" }>({
        name: "adddate",
        order: "DESC",
    });

    useEffect(() => {
        fetchProducts();
        fetchProductCategory()
        fetchUnit()
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, sort]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { docs } = await getProductBy({
                search: {
                    text: search,
                    columns: ["product_name", "product_id"],
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

    const fetchProductCategory = async () => {
        setLoading(true);
        try {
            const { docs } = await getProductCategoryBy(
                selectedCategory ? { product_category_id: selectedCategory } : {}
            );
            setProductCategory(docs.map(item => ({ title: item.product_category_name, value: item.product_category_id })));
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    };

    const fetchUnit = async () => {
        setLoading(true);
        try {
            const { docs } = await getUnitBy();
            setUnit(docs);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    };

    const addToCart = async (product_id: string) => {
        try {
            await insertCart({
                cart_id: "",
                cart_amount: 1,
                cart_status: "0",
                product_id: product_id,
            });
            await refreshCart();
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert('เกิดข้อผิดพลาดในการเพิ่มสินค้าลงตะกร้า');
        }
    };

    const handleViewDetails = (productId: string) => {
        router.push(`/sales/product-details?id=${productId}`);
    };

    const openMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
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
                        getOptionLabel={(option) => option.title}
                        value={productCategory.find(item => item.value === selectedCategory) || null}
                        onChange={(event, newValue) => setSelectedCategory(newValue?.value || "")}
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
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
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
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
                            <Card className="flex flex-col h-full shadow-lg rounded-lg overflow-hidden">
                                <Box className="relative w-full h-48 overflow-hidden">
                                    {(!product.product_img || product.product_img === "") ? (
                                        <div className="h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500">ไม่มีรูปภาพ</span>
                                        </div>
                                    ) : (() => {
                                        const images = product.product_img.split(",");
                                        const totalImages = images.length;

                                        const getGridClass = (total: number) => {
                                            switch (total) {
                                                case 1: return 'grid-cols-1';
                                                case 2: return 'grid-cols-2';
                                                case 3: return 'grid-cols-3';
                                                case 4: return 'grid-cols-2 grid-rows-2';
                                                default: return 'grid-cols-3';
                                            }
                                        };

                                        const displayImages = totalImages <= 5 ? images : images.slice(0, 5);

                                        return (
                                            <div className={`h-full grid ${getGridClass(totalImages)} gap-0.5`}>
                                                {displayImages.map((img, index) => (
                                                    <div key={index} className={`relative ${totalImages > 5 && index === 4 ? 'last-image' : ''}`}>
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
                                    })()}
                                </Box>
                                <CardContent className="flex-grow p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <Typography
                                            gutterBottom
                                            variant="h6"
                                            component="div"
                                            className="font-semibold text-lg h-[50px] overflow-hidden"
                                            sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                wordBreak: 'break-word',
                                                lineHeight: '1.2'
                                            }}
                                        >
                                            {product.product_name}
                                        </Typography>
                                        <IconButton
                                            onClick={() => handleViewDetails(product.product_id)}
                                            className="hover:bg-gray-200 rounded-full p-1 ml-2 flex-shrink-0"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M17.4 17h-1.8a1.6 1.6 0 0 1-1.6-1.6v-3.8a1.6 1.6 0 0 1 1.6-1.6h1.8a1.6 1.6 0 0 1 1.6 1.6v3.8a1.6 1.6 0 0 1-1.6 1.6m-9 0H6.6A1.6 1.6 0 0 1 5 15.4V3.6A1.6 1.6 0 0 1 6.6 2h1.8A1.6 1.6 0 0 1 10 3.6v11.8A1.6 1.6 0 0 1 8.4 17" />
                                                <path fill="currentColor" fillRule="evenodd" d="M1 21a1 1 0 0 0 1 1h20a1 1 0 1 0 0-2H2a1 1 0 0 0-1 1" clipRule="evenodd" />
                                            </svg>
                                        </IconButton>
                                    </div>
                                    <div className="space-y-2">
                                        <Typography variant="body2" color="text.secondary">
                                            รหัสสินค้า: <span className="font-medium">{product.product_id}</span>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            จำนวนคงเหลือ: <span className="font-medium">{product.product_quantity} {(() => {
                                                const un = unit.find((e) => e.unit_id === product.unit_id);
                                                return un ? `${un.unit_name_th}` : "";
                                            })()}</span>
                                        </Typography>
                                    </div>
                                    <p className="text-[#d59d35] mt-3 text-[18px] font-[400]">
                                        {decimalFix(product.product_price)} ฿ / {(() => {
                                            const un = unit.find((e) => e.unit_id === product.unit_id);
                                            return un ? `${un.unit_name_th}` : "";
                                        })()}
                                    </p>
                                </CardContent>
                                <CardActions className="justify-center">
                                    <button
                                        className="flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-[#e6ba78] rounded-2xl w-full py-2 px-3 transition-all duration-200 shadow-lg"
                                        onClick={() => addToCart(product.product_id)}
                                    >
                                        <AddShoppingCart className="mr-2" />
                                        เพิ่มลงตะกร้า
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