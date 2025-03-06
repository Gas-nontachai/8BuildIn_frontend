"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography, Grid, IconButton, Paper } from "@mui/material";
import { Delete, Remove, Add } from "@mui/icons-material";
import { useCart, useProduct } from "@/hooks/hooks"; // นำเข้า useProduct
import { CartItemWithProduct } from "@/misc/cart";
import { decimalFix } from "@/utils/number-helper";
import { API_URL } from "@/utils/config";

const CartDetails = () => {
    const router = useRouter();
    const { getCartBy, updateCartBy, deleteCartBy } = useCart();
    const { getProductByID } = useProduct(); // สร้าง instance ของ useProduct
    const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const { docs } = await getCartBy({
                addby: "your_employee_id", // เปลี่ยนเป็น ID ของผู้ใช้ที่ล็อกอิน
                cart_status: "0"
            });
            const cartWithProducts = await Promise.all(
                docs.map(async (item) => {
                    const productData = await getProductByID({ product_id: item.product_id });
                    return { ...item, product: productData };
                })
            );
            setCartItems(cartWithProducts as CartItemWithProduct[]);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (cart_id: string, amount: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.cart_id === cart_id ? { ...item, cart_amount: String(Number(item.cart_amount) + amount) } : item
            )
        );
    };

    const handleUpdateCart = async () => {
        try {
            await Promise.all(cartItems.map(item => updateCartBy(item)));
            alert("อัพเดตตะกร้าเรียบร้อยแล้ว");
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const handleDeleteItem = async (cart_id: string) => {
        try {
            await deleteCartBy({ cart_id });
            setCartItems((prevItems) => prevItems.filter(item => item.cart_id !== cart_id));
        } catch (error) {
            console.error("Error deleting cart item:", error);
        }
    };

    if (loading) {
        return <Typography>กำลังโหลด...</Typography>;
    }

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

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>รายละเอียดตะกร้า</Typography>
            <Box>
                {cartItems.map((item) => (
                    <Paper
                        key={item.cart_id}
                        elevation={2}
                        sx={{
                            mb: 2,
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        {/* ส่วนรูปภาพด้านซ้าย */}
                        <Box sx={{ width: '150px', height: '150px' }}>
                            <Box className={`grid ${getGridClass(item.product?.product_img?.split(',').length || 0)}`}>
                                {item.product?.product_img ? (
                                    item.product.product_img.split(',').map((img, index) => (
                                        <img
                                            key={index}
                                            src={`${API_URL}${img}`}
                                            alt={`Product ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ))
                                ) : (
                                    <Typography>ไม่มีรูปภาพ</Typography>
                                )}
                            </Box>
                        </Box>

                        {/* ส่วนรายละเอียดสินค้า */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6">
                                {item.product?.product_name}
                            </Typography>
                            <Typography color="primary" variant="h6">
                                ฿{decimalFix(item.product?.product_price || 0)}
                            </Typography>
                        </Box>

                        {/* ส่วนปุ่มเพิ่ม/ลดจำนวน */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                                onClick={() => handleQuantityChange(item.cart_id, -1)}
                                disabled={decimalFix(item.cart_amount) <= 1}
                                size="small"
                            >
                                <Remove />
                            </IconButton>
                            <Typography sx={{ minWidth: '40px', textAlign: 'center' }}>
                                {item.cart_amount}
                            </Typography>
                            <IconButton
                                onClick={() => handleQuantityChange(item.cart_id, 1)}
                                size="small"
                            >
                                <Add />
                            </IconButton>
                        </Box>

                        {/* ส่วนแสดงจำนวนคงเหลือ */}
                        <Box sx={{ minWidth: '100px', textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                คงเหลือ
                            </Typography>
                            <Typography>
                                {item.product?.product_quantity} ชิ้น
                            </Typography>
                        </Box>

                        {/* ปุ่มลบ */}
                        <IconButton
                            onClick={() => handleDeleteItem(item.cart_id)}
                            color="error"
                        >
                            <Delete />
                        </IconButton>
                    </Paper>
                ))}
            </Box>

            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    mt: 2,
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Box>
                    <Typography variant="h6">
                        รวมทั้งหมด: {cartItems.length} รายการ
                    </Typography>
                    <Typography variant="h5" color="primary">
                        ราคารวม: {decimalFix(
                            cartItems.reduce((total, item) =>
                                total + (decimalFix(item.product?.product_price || 0) * decimalFix(item.cart_amount)),
                                0
                            ).toString()
                        )} บาท
                    </Typography>
                </Box>
                </Paper>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateCart}
                    sx={{ mt: 2 }}
                    fullWidth
                >
                    บันทึกการเปลี่ยนแปลง
                </Button>
         
        </Box>
    );
};
export default CartDetails;