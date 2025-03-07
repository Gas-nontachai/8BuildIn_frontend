"use client";
import { useEffect, useState } from "react";
import { Popover, Box, Button, List, ListItem, Divider, IconButton } from "@mui/material";
import { ShoppingBag, HighlightOff } from "@mui/icons-material";
import { useProduct, useCart } from "@/hooks/hooks";
import { Product } from '@/misc/types';
import { decimalFix } from "@/utils/number-helper";
import { API_URL } from "@/utils/config";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const { deleteCartBy } = useCart();

export default function CartDropdown() {
    const router = useRouter();
    const { cartItems, refreshCart } = useCartContext();
    const { $profile } = AuthProvider();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const { getProductBy } = useProduct();

    useEffect(() => {
        if (cartItems.length > 0) {
            fetchProducts();
        }
    }, [cartItems]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const product_ids = cartItems.map(item => item.product_id);
            const { docs } = await getProductBy({
                match: {
                    product_id: { $in: product_ids }
                }
            });
            setProducts(docs);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onDeleteCart = async (cart_id: string) => {
        try {
            await deleteCartBy({ cart_id: cart_id });
            await refreshCart();
        } catch (error) {
            console.error("Error deleting cart item:", error);
        }
    };

    return (
        <>
            <button
                className="relative p-2 hover:bg-[#333333] rounded-md transition-transform hover:scale-110"
                onClick={handleClick}
            >
                {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-[500] rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItems.length}
                    </span>
                )}
                <ShoppingBag className="text-white text-2xl" />
            </button>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Box sx={{ width: 400, p: 2 }}>
                    {cartItems.length == 0 ? (
                        <>
                            <div className="flex flex-col">
                                <span className="text-gray-700 text-[17px] font-[400]">ตะกร้าสินค้า</span>
                                <div className="flex justify-start mt-2">
                                    <span className="text-[15px] font-300 text-gray-500">ไม่มีสินค้าในตะกร้า...</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="text-gray-700 text-[17px] font-[400]">ตะกร้าสินค้า</span>
                            <List sx={{ maxHeight: 300, overflowY: "auto" }}>
                                {cartItems.map((item) => {
                                    const productDetails = products.find((p) => p.product_id === item.product_id);
                                    return (
                                        <Box key={item.cart_id}>
                                            <ListItem>
                                                <img
                                                    src={productDetails?.product_img
                                                        ? `${API_URL}${productDetails.product_img.split(',').pop()}`
                                                        : "/default-cart.png"
                                                    }
                                                    className="w-10 h-10 object-cover mr-5"
                                                    alt="Product"
                                                />
                                                <div className="flex-1">
                                                    <p>{productDetails?.product_name || "Unknown"}</p>
                                                    <p className="text-sm text-gray-500">x {item.cart_amount}</p>
                                                </div>
                                                <div className="flex-shrink-0 mr-2">
                                                    <p className="text-gray-600 font-[400]">
                                                        ฿ {decimalFix(productDetails?.product_price || 0)}
                                                    </p>
                                                </div>
                                                <IconButton onClick={() => onDeleteCart(item.cart_id)} color="error">
                                                    <HighlightOff fontSize="small" />
                                                </IconButton>
                                            </ListItem>
                                            <Divider />
                                        </Box>
                                    );
                                })}
                                {cartItems.length > 0 && (
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-gray-700 text-[13px]">{cartItems.length} สินค้า</span>
                                        <Button variant="text" color="info" onClick={() => router.push(`/sales/cart-details?emp_id=${$profile.employee_id}`)}>
                                            ดูตะกร้าสินค้า
                                        </Button>
                                    </div>
                                )}
                            </List>
                        </>
                    )}
                </Box>
            </Popover >
        </>
    );
}