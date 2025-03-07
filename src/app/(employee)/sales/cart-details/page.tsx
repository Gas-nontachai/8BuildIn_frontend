"use client";
import React, { useEffect, useState } from 'react'
import { pdf } from '@react-pdf/renderer';
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { Delete, Add, Remove } from "@mui/icons-material";
import { useCart, useProduct } from "@/hooks/hooks";
import { Cart, Product } from '@/misc/types';
import { API_URL } from "@/utils/config";
import { decimalFix, toFloat, toInt } from "@/utils/number-helper";
import { useSearchParams } from 'next/navigation';
import { useCartContext } from "@/context/CartContext";
import Quotation from '@/app/components/Sales/(PDF)/Quotation';


const { getCartBy, deleteCartBy, updateCartBy } = useCart();
const { getProductBy } = useProduct();

const CartDetailPage = () => {
    const searchParams = useSearchParams();
    const employee_id = searchParams.get('emp_id');
    const { cartItems, refreshCart } = useCartContext();

    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState<Cart[]>([]);
    const [editedCart, setEditedCart] = useState<Cart[]>([]);
    const [product, setProduct] = useState<Product[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isEdited, setIsEdited] = useState(false);

    useEffect(() => {
        try {
            setLoading(true);
            fetchData();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, [cartItems]);

    const fetchData = async () => {
        try {
            let total_price = 0;
            const { docs: res } = await getCartBy({ match: { addby: employee_id, cart_status: "0" } });
            const product_list_arr = res.map(item => item.product_id);
            const { docs: product_list } = await getProductBy({
                match: { product_id: { $in: product_list_arr } }
            });

            setCart(res);
            setEditedCart(res);
            setProduct(product_list);

            res.forEach(cartItem => {
                const product = product_list.find(item => item.product_id === cartItem.product_id);
                if (product) {
                    total_price += toFloat(product.product_price) * toInt(cartItem.cart_amount);
                }
            });
            setTotalPrice(total_price);
        } catch (error) {
            console.error("Error fetching StockIn:", error);
        }
    };

    const onDeleteCart = async (cart_id: string) => {
        setLoading(true);
        try {
            await deleteCartBy({ cart_id });
            await fetchData();
            await refreshCart();
        } catch (error) {
            console.error("Error deleting cart item:", error);
        }
        setLoading(false);
    };

    const onUpdateCartAmount = (index_cart: number, type: "increase" | "decrease") => {
        let newCart = [...editedCart];
        let item = { ...newCart[index_cart] };

        if (type === "increase") {
            item.cart_amount = toInt(item.cart_amount) + 1;
        } else if (type === "decrease") {
            item.cart_amount = Math.max(toInt(item.cart_amount) - 1, 1);
        }

        newCart[index_cart] = item;
        setEditedCart(newCart);
        setIsEdited(true);
    };

    const onSaveChanges = async () => {
        try {
            await Promise.all(editedCart.map(item => updateCartBy(item)));
            await fetchData();
            setIsEdited(false);
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const openPdfInNewTab = async () => {
        const blob = await pdf(<Quotation />).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        // setTimeout(() => URL.revokeObjectURL(url), 10000);
    };


    return (
        <Box sx={{ p: 4 }}>
            <span className='text-gray-700 font-1000 font-bold text-[30px] mb-2'>ตะกร้าสินค้า</span>
            {loading ? (
                <Typography variant="body1">กำลังโหลดข้อมูล...</Typography>
            ) : (
                <Box>
                    {cart.length === 0 ? (
                        <span className='text-gray-700 font-4000 text-[20px] mb-t'>ไม่มีสินค้าในตะกร้า ....</span>
                    ) : (
                        editedCart.map((item, index) => {
                            const productDetail = product.find(p => p.product_id === item.product_id);
                            return (
                                <Box key={item.cart_id} sx={{ mb: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                        <img
                                            src={productDetail?.product_img ? `${API_URL}${productDetail.product_img.split(",").pop()}` : "/default-cart.png"}
                                            alt="Product"
                                            className="w-16 h-16 object-cover mr-5"
                                        />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="body1">{productDetail?.product_name || "Unknown"}</Typography>
                                            <Typography variant="body2" color="textSecondary">x {item.cart_amount}</Typography>
                                        </Box>
                                        <Box sx={{ textAlign: "right" }}>
                                            <p className="text-gray-600 font-[400]">
                                                ฿ {decimalFix(productDetail?.product_price || 0)}
                                            </p>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <IconButton onClick={() => onUpdateCartAmount(index, 'decrease')} disabled={Number(item.cart_amount) <= 1}>
                                                <Remove fontSize="small" />
                                            </IconButton>
                                            <Typography variant="body2">{item.cart_amount}</Typography>
                                            <IconButton onClick={() => onUpdateCartAmount(index, 'increase')}>
                                                <Add fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        <IconButton onClick={() => onDeleteCart(item.cart_id)} color="error" size="small">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <Divider />
                                </Box>
                            );
                        })
                    )}
                    {cart.length > 0 && (
                        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6">รวม {cart.length} สินค้า</Typography>
                            <Typography variant="h6">฿ {decimalFix(totalPrice)}</Typography>
                            {isEdited && (
                                <Button variant="contained" color="primary" onClick={onSaveChanges}>
                                    อัพเดตตะกร้า
                                </Button>
                            )}
                            <Button onClick={() => openPdfInNewTab(editedCart)} variant="contained" color="secondary">
                                ออกใบเสนอราคา
                            </Button>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default CartDetailPage;
