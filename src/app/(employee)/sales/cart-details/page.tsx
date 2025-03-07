"use client";
import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useCart, useProduct } from "@/hooks/hooks";
import { Cart, Product } from '@/misc/types';
import { API_URL } from "@/utils/config";
import { decimalFix } from "@/utils/number-helper";
import { useSearchParams } from 'next/navigation';

const { getCartBy, deleteCartBy } = useCart();
const { getProductBy } = useProduct();
const CartDetailPage = () => {
    const searchParams = useSearchParams()
    const employee_id = searchParams.get('emp_id');

    const [loading, setLoading] = useState(false);

    const [cart, setCart] = useState<Cart[]>([]);
    const [product, setProduct] = useState<Product[]>([]);

    useEffect(() => {

        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {

            const { docs: res } = await getCartBy({ match: { addby: employee_id } });
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

    const onDeleteCart = (cart_id: string) => {
    }
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                ตะกร้าสินค้า
            </Typography>
            {loading ? (
                <Typography variant="body1">กำลังโหลดข้อมูล...</Typography>
            ) : (
                <Box>
                    {cart.length === 0 ? (
                        <Typography variant="body1">ตะกร้าของคุณว่างเปล่า</Typography>
                    ) : (
                        cart.map((item, index) => (
                            <Box key={item.cart_id} sx={{ mb: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    {
                                        product.find((s) => s.product_id === cart[index]?.product_id)?.product_img ? (
                                            <img
                                                src={`${API_URL}${product.find((s) => s.product_id === cart[index]?.product_id)?.product_img.split(",").pop()}`}
                                                alt="Product"
                                                className="w-16 h-16 object-cover mr-5"
                                            />
                                        ) : (
                                            <img
                                                src="/default-cart.png"
                                                alt="Product"
                                                className="w-16 h-16 object-cover mr-5"
                                            />
                                        )
                                    }
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body1">
                                            {product.find((s) => s.product_id === cart[index]?.product_id)?.product_name || "Unknown"}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            x {item.cart_amount}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: "right" }}>
                                        <Typography variant="body1" color="error">
                                            ฿ {decimalFix(product.find((s) => s.product_id === cart[index]?.product_id)?.product_price || 0)}
                                        </Typography>
                                    </Box>
                                    <IconButton onClick={() => onDeleteCart(item.cart_id)} color="error" size="small">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Divider />
                            </Box>
                        ))
                    )}
                    {cart.length > 0 && (
                        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6">รวม {cart.length} สินค้า</Typography>
                            <Button variant="contained" color="primary">
                                ไปที่หน้าชำระเงิน
                            </Button>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default CartDetailPage 
