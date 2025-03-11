"use client";
import React, { useEffect, useState } from 'react'
import { pdf } from '@react-pdf/renderer';
import { Box, Button, Divider, IconButton, Typography, Breadcrumbs, Link, Stack, } from "@mui/material";
import { DeleteForever, Add, Remove, ReceiptLong, ShoppingCart, FirstPage, ShoppingBag } from "@mui/icons-material";
import { useCart, useEmployee, useProduct } from "@/hooks/hooks";
import { Cart, Product } from '@/misc/types';
import { API_URL } from "@/utils/config";
import { decimalFix, toFloat, toInt } from "@/utils/number-helper";
import { useSearchParams } from 'next/navigation';
import { useCartContext } from "@/context/CartContext";
import Quotation from '@/app/components/Sales/(PDF)/Quotation';

const { getCartBy, deleteCartBy, updateCartBy } = useCart();
const { getProductBy } = useProduct();
const { getEmployeeByID } = useEmployee();
const { getProductByID } = useProduct();

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

    const openPdfInNewTab = async (editedCart: Cart[]) => {
        try {
            // 1. ดึงข้อมูลพนักงาน
            const employeeData = await getEmployeeByID({
                employee_id: editedCart[0].addby || ""
            });

            // 2. ดึงข้อมูลสินค้าทั้งหมด
            const productPromises = editedCart.map(cart =>
                getProductByID({ product_id: cart.product_id })
            );
            const products = await Promise.all(productPromises);

            // 3. สร้างข้อมูลสำหรับ PDF
            const quotationData = {
                employee: employeeData,
                products: products.map((product, index) => ({
                    ...product,
                    quantity: editedCart[index].cart_amount.toString(),
                    total: Number(product.product_price) * Number(editedCart[index].cart_amount)
                })),
                totalAmount: products.reduce((sum, product, index) =>
                    sum + (Number(product.product_price) * Number(editedCart[index].cart_amount)),
                    0
                )
            };

            // 4. สร้าง PDF
            const blob = await pdf(
                <Quotation
                    employee={quotationData.employee}
                    products={quotationData.products}
                    totalAmount={quotationData.totalAmount}
                />
            ).toBlob();

            // 5. เปิด PDF ในแท็บใหม่
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            console.log("quotationData", quotationData);
            console.log("editedCart", editedCart);
            console.log("employeeData", employeeData);
            console.log("productPromises", productPromises);
            console.log("products", products);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };



    return (
        <>
            <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
                <Link underline="hover" href="/sales">
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
                        <FirstPage fontSize="small" />
                        <Typography variant="body1" color="primary">ย้อนกลับ</Typography>
                    </Stack>
                </Link>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <ShoppingBag fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body1" color="text.secondary">รายละเอียดตะกร้า</Typography>
                </Stack>
            </Breadcrumbs>
            <Divider />
            <Box sx={{ p: 4 }}>
                <div className='mb-5'>
                    <span className='text-gray-700 font-500 font-bold text-[25px]'>ตะกร้าสินค้า</span>
                </div>
                {loading ? (
                    <Typography variant="body1">กำลังโหลดข้อมูล...</Typography>
                ) : cart.length === 0 ? (
                    <span className='text-gray-700 font-4000 text-[20px] mb-t'>ไม่มีสินค้าในตะกร้า ....</span>
                ) : (
                    <Box>
                        {editedCart.map((item, index) => {
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
                                            <p className="text-gray-600 font-[400] mr-10">
                                                ฿ {decimalFix(productDetail?.product_price || 0)}
                                            </p>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <IconButton onClick={() => onUpdateCartAmount(index, 'decrease')} disabled={Number(item.cart_amount) <= 1}>
                                                <Remove fontSize="small" />
                                            </IconButton>
                                            <Typography variant="body2">{item.cart_amount}</Typography>
                                            <IconButton onClick={() => onUpdateCartAmount(index, 'increase')}>
                                                <Add fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        <IconButton onClick={() => onDeleteCart(item.cart_id)} color="error">
                                            <DeleteForever />
                                        </IconButton>
                                    </Box>
                                    <Divider />
                                </Box>
                            );
                        })}
                        <div className='flex justify-between items-center'>
                            <div className="flex flex-col justify-start gap-2">
                                <span className="font-[400] text-[14px]">สินค้าในตะกร้า {cart.length} สินค้า</span>
                                <span className="font-[400] text-[17px]">ราคารวมทั้งหมด :&nbsp;
                                    <span className="font-[500] text-[#d59d35] text-[20px]">
                                        {decimalFix(totalPrice)} ฿</span>
                                </span>

                            </div>
                            <div className='flex gap-2'>
                                {isEdited && (
                                    <button
                                        className="flex items-center gap-1 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-[#d4a34a] rounded-md py-2 px-3 transition-all duration-200 shadow-lg"
                                        onClick={onSaveChanges}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        อัพเดตตะกร้า
                                    </button>
                                )}
                                <button
                                    className="flex items-center gap-1 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-[#d4a34a] rounded-md py-2 px-3 transition-all duration-200 shadow-lg"
                                    onClick={() => openPdfInNewTab(editedCart)}
                                >
                                    <ReceiptLong className="w-4 h-4" />
                                    ออกใบเสนอราคา
                                </button>
                            </div>
                        </div>
                    </Box>
                )}
            </Box>
        </>
    );
}

export default CartDetailPage;
