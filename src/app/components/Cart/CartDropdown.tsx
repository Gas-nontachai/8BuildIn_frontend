"use client";
import { useEffect, useState } from "react";
import { Popover, Box, Button, List, ListItem, Divider, IconButton } from "@mui/material";
import { ShoppingBag, Delete } from "@mui/icons-material";
import { AuthProvider } from "@/context/AuthContext";
import { useCart, useProduct } from "@/hooks/hooks";
import { Cart, Product } from '@/misc/types';
import { decimalFix } from "@/utils/number-helper";
import { API_URL } from "@/utils/config";
import { useRouter } from "next/navigation";

const { getCartBy, deleteCartBy } = useCart();
const { getProductBy } = useProduct();

export default function CartDropdown() {
    const router = useRouter();
    const { $profile } = AuthProvider();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loading, setLoading] = useState(false);

    const [cart, setCart] = useState<Cart[]>([]);
    const [product, setProduct] = useState<Product[]>([]);

    useEffect(() => {
        fetchData();
    }, [anchorEl]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { docs: res } = await getCartBy({ match: { addby: $profile.employee_id } });
            const product_list_arr = res.map(item => item.product_id);

            const { docs: product_list } = await getProductBy({
                match: {
                    product_id: { $in: product_list_arr }
                }
            });
            setCart(res);
            setProduct(product_list);
        } catch (error) {
            console.error("Error fetching StockIn:", error);
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
            await deleteCartBy({ cart_id: cart_id })
            fetchData()
        } catch (error) {

        }
    }

    return (
        <>
            <button
                className="relative p-2 hover:bg-[#333333] rounded-md transition-transform hover:scale-110"
                onClick={handleClick}
            >
                {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-[500] rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                    </span>
                )}
                <ShoppingBag className="text-white text-2xl" />
            </button>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}>
                <Box sx={{ width: 400, p: 2 }}>
                    <span className="text-gray-700 text-[17px] font-[400]">ตะกร้าสินค้า</span>
                    <List sx={{ maxHeight: 300, overflowY: "auto" }}>
                        {cart.map((item, index) => (
                            <Box key={item.cart_id}>
                                <ListItem>
                                    <img
                                        src={
                                            product?.find((s) => s.product_id === cart[index]?.product_id)?.product_img
                                                ? `${API_URL}${product.find((s) => s.product_id === cart[index]?.product_id)?.product_img.split(',').pop()}`
                                                : "default-cart.png"
                                        }
                                        className="w-10 h-10 object-cover mr-5"
                                        alt="Product"
                                    />
                                    <div className="flex-1">
                                        <p>
                                            {product.find((s) => s.product_id === cart[index].product_id)?.product_name || "Unknown"}
                                        </p>
                                        <p className="text-sm text-gray-500">x {item.cart_amount}</p>
                                    </div>
                                    <div className="flex-shrink-0 mr-2">
                                        <p className="text-[#d32f2f] font-[400]">
                                            ฿ {decimalFix(product.find((s) => s.product_id === cart[index].product_id)?.product_price || 0)}
                                        </p>
                                    </div>
                                    <IconButton onClick={() => onDeleteCart(item.cart_id)} size="small" color="default">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </ListItem>
                                <Divider />
                            </Box>
                        ))}
                        {cart.length > 0 && (
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-gray-700 text-[13px]">{cart.length} สินค้า </span>
                                <Button variant="text" color="info" onClick={() => router.push(`/sales/cart-details`)}>
                                    ดูตะกร้าสินค้า
                                </Button>
                            </div>
                        )}
                    </List>
                </Box>
            </Popover>
        </>
    );
}
