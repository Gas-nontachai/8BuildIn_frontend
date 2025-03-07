"use client";
import { useEffect, useState } from "react";
import { Button, Box, List, ListItem, Divider, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { AuthProvider } from "@/context/AuthContext";
import { useCart, useProduct } from "@/hooks/hooks";
import { Cart, Product } from '@/misc/types';
import { decimalFix } from "@/utils/number-helper"
import { API_URL } from "@/utils/config";
import { useRouter } from "next/navigation";

const { getCartBy, deleteCartBy } = useCart();
const { getProductBy } = useProduct();

export default function CartDetail() {
    const router = useRouter();
    const { $profile } = AuthProvider();

    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState<Cart[]>([]);
    const [product, setProduct] = useState<Product[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

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
            console.error("Error fetching Cart details:", error);
        }
        setLoading(false);
    };

    const handleRemoveItem = async (cartId: string) => {
        try {
            await deleteCartBy({ cart_id: cartId });
            fetchData();
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const productPrice = product.find((p) => p.product_id === item.product_id)?.product_price || 0;
            return total + (productPrice * Number(item.cart_amount));
        }, 0);
    };

    return (
        <Box sx={{ width: "100%", p: 2 }}>
            <h2>รายละเอียดตะกร้าสินค้า</h2>
            <List sx={{ maxHeight: 400, overflowY: "auto" }}>
                {cart.map((item) => {
                    const productDetails = product.find((p) => p.product_id === item.product_id);
                    return (
                        <Box key={item.cart_id}>
                            <ListItem>
                                <img
                                    src={productDetails?.product_img ? `${API_URL}${productDetails.product_img.split(',').pop()}` : "default-cart.png"}
                                    alt="Product"
                                    className="w-10 h-10 object-cover mr-5"
                                />
                                <div className="flex-1">
                                    <p>{productDetails?.product_name || "Unknown"}</p>
                                    <p className="text-sm text-gray-500">x {item.cart_amount}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <p>{decimalFix(productDetails?.product_price || 0)}</p>
                                </div>
                                {/* Remove item button */}
                                <IconButton size="small" color="error" onClick={() => handleRemoveItem(item.cart_id)}>
                                    <Delete fontSize="small" />
                                </IconButton>
                            </ListItem>
                            <Divider />
                        </Box>
                    );
                })}

                {cart.length > 0 && (
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-700 text-[13px]">รวม {cart.length} สินค้า</span>
                        <span className="text-gray-700 text-[15px]">Total: ฿{decimalFix(calculateTotal())}</span>
                    </div>
                )}
            </List>

            {cart.length > 0 && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push(`/sales/checkout`)}
                    sx={{ mt: 2 }}
                >
                    ไปที่การชำระเงิน
                </Button>
            )}
        </Box>
    );
}
