"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { Newspaper, FirstPage } from "@mui/icons-material";
import {
    Typography,
    Box,
    Grid,
    Link,
    Stack,
    Breadcrumbs,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@mui/material";
import { useProduct, useCart, useEmployee, useUnit, useMaterial } from "@/hooks/hooks";
import { Product, Employee, Unit, Material } from "@/misc/types"
import { formatDate } from "@/utils/date-helper"
import { decimalFix } from "@/utils/number-helper"
import { API_URL } from "@/utils/config";
import Loading from "@/app/components/Loading";
import { useCartContext } from "@/context/CartContext";

const { getProductByID } = useProduct();
const { insertCart } = useCart();
const { getEmployeeBy } = useEmployee();
const { getUnitBy } = useUnit();
const { getMaterialBy } = useMaterial();

const ProductDetails = () => {
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const [product, setProduct] = useState<Product | null>(null);
    const [employee, setEmployee] = useState<Employee[]>([]);
    const [unit, setUnit] = useState<Unit[]>([]);
    const [material, setMaterial] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>('');

    const { refreshCart } = useCartContext();
    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        if (product?.product_img) {
            const firstImage = product.product_img.split(',')[0];
            setSelectedImage(firstImage);
        }
    }, [product]);

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

    const fetchProductDetails = async () => {
        if (!productId) return;
        try {
            const res_pd = await getProductByID({
                product_id: productId
            });
            const sub_emp = [res_pd.addby, res_pd.updateby].flat();
            const sub_unit = [res_pd.unit_id].flat();

            const { docs: res_emp } = await getEmployeeBy({
                match: {
                    employee_id: { $in: sub_emp }
                }
            });
            const { docs: res_unit } = await getUnitBy({
                match: {
                    unit_id: { $in: sub_unit }
                }
            });
            const { docs: res_mat } = await getMaterialBy();
            setProduct(res_pd);
            setEmployee(res_emp);
            setUnit(res_unit);
            setMaterial(res_mat);
        } catch (error) {
            console.error("Error fetching product details:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderProductImages = (productImg: string | null) => {
        if (!productImg) {
            return (
                <div className="text-center">
                    <div className="h-96 bg-gray-200 flex items-center justify-center mb-4">
                        <span className="text-gray-500">ไม่มีรูปภาพ</span>
                    </div>
                </div>
            );
        }
        const images = productImg.split(",");
        return (
            <div className="space-y-4">
                <div className="h-96 w-full border rounded-lg overflow-hidden">
                    <img
                        src={`${API_URL}${selectedImage}`}
                        alt="Selected product"
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="grid grid-cols-5 gap-2">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={`cursor-pointer border-2 rounded-lg overflow-hidden
                                ${selectedImage === img ? 'border-blue-500' : 'border-transparent'}`}
                            onClick={() => setSelectedImage(img)}
                        >
                            <img
                                src={`${API_URL}${img}`}
                                alt={`Product ${index + 1}`}
                                className="w-full h-20 object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    if (!product) {
        return (
            <Box p={4}>
                <Typography variant="h6">ไม่พบข้อมูลสินค้า</Typography>
            </Box>
        );
    }
    return (
        <>
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
                    <Link underline="hover" href="/sales">
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
                            <FirstPage fontSize="small" />
                            <Typography variant="body1" color="primary">ย้อนกลับ</Typography>
                        </Stack>
                    </Link>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Newspaper fontSize="small" />
                        <Typography variant="body1" color="text.secondary">รายละเอียดสินค้า</Typography>
                    </Stack>
                </Breadcrumbs>
            </Box>
            {loading ? (
                <Loading />
            ) : (
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                        {renderProductImages(product.product_img)}
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <div className="space-y-4">
                            <Typography variant="h4" className="font-semibold">{product.product_name}</Typography>
                            <Typography variant="h5" className="text-[#e6ba78]">
                                ราคา: {decimalFix(product.product_price)} บาท / {(() => {
                                    const un = unit.find((e) => e.unit_id === product.unit_id);
                                    return un ? `${un.unit_name_th}(${un.unit_name_en})` : "";
                                })()}
                            </Typography>
                            <div className="space-y-2">
                                <Typography variant="body1" color="text.secondary">
                                    รหัสสินค้า: {product.product_id}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    จำนวนคงเหลือ: {product.product_quantity} {(() => {
                                        const un = unit.find((e) => e.unit_id === product.unit_id);
                                        return un ? `${un.unit_name_th}(${un.unit_name_en})` : "";
                                    })()}
                                </Typography>
                            </div>
                            <Button
                                sx={{ color: '#e6ba78' }}
                                className="flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black rounded-2xl w-full py-2 px-3 transition-all duration-200 shadow-lg"
                                disabled={!product.product_quantity || parseInt(product.product_quantity) <= 0}
                                onClick={() => addToCart(product.product_id)}
                            >
                                เพิ่มลงตะกร้า
                            </Button>
                            <div className="pt-4 border-t space-y-2">
                                <Typography variant="body2" color="text.secondary">
                                    วันที่เพิ่ม: {formatDate(product.adddate, 'dd/MM/yyyy HH:mm:ss')} โดย: {(() => {
                                        const emp = employee.find((e) => e.employee_id === product.updateby);
                                        return emp ? `${emp.employee_firstname} ${emp.employee_lastname}` : "";
                                    })()}
                                </Typography>
                                {product.updateby && (
                                    <Typography variant="body2" color="text.secondary">
                                        แก้ไขล่าสุด: {formatDate(product.lastupdate, 'dd/MM/yyyy HH:mm:ss')} โดย: {(() => {
                                            const emp = employee.find((e) => e.employee_id === product.updateby);
                                            return emp ? `${emp.employee_firstname} ${emp.employee_lastname}` : "";
                                        })()}
                                    </Typography>
                                )}
                                {product.stock_in_id ? (
                                    <Typography variant="body2" color="text.secondary">
                                        สินค้าจากสต็อค: {product.stock_in_id}
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        สินค้าคัสตอมจาก 8Built-In
                                    </Typography>
                                )}
                            </div>
                        </div>
                    </Grid>
                    {product.material && (
                        <Grid item xs={12}>
                            <div className="space-y-4">
                                <Typography variant="body1">
                                    รายการต้นทุนถอดละเอียด
                                </Typography>

                                <Table size="small" aria-label="materials">
                                    <TableHead className="bg-gray-200">
                                        <TableRow>
                                            <TableCell sx={{ width: '25%' }}>ชื่อวัสดุ</TableCell>
                                            <TableCell sx={{ width: '25%' }}>จำนวน</TableCell>
                                            <TableCell sx={{ width: '25%' }}>ราคา (บาท)</TableCell>
                                            <TableCell sx={{ width: '25%' }}>ราคารวม (บาท)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {JSON.parse(product.material).map((item: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{material.find((e) => e.material_id === item.material_id)?.material_name}</TableCell>
                                                <TableCell>{item.material_quantity}
                                                    {(() => {
                                                        const un = unit.find((e) => e.unit_id === item.unit_id);
                                                        return un ? `${un.unit_name_th} (${un.unit_name_en})` : "";
                                                    })()}
                                                </TableCell>
                                                <TableCell>{decimalFix(item.material_price)} ฿</TableCell>
                                                <TableCell>{decimalFix(item.material_price * item.material_quantity)} ฿</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="mt-4">
                                    <Typography variant="body2" className="font-semibold">
                                        สรุป:
                                    </Typography>
                                    <Typography variant="body2">
                                        จำนวนวัสดุทั้งหมด: {JSON.parse(product.material).reduce((acc: any, item: any) => acc + item.material_quantity, 0)} ชิ้น
                                    </Typography>
                                    <Typography variant="body2">
                                        ราคารวมทั้งหมด: {decimalFix(
                                            JSON.parse(product.material).reduce((acc: any, item: any) => acc + item.material_price * item.material_quantity, 0)
                                        )} ฿
                                    </Typography>
                                </div>
                            </div>
                        </Grid>
                    )}
                </Grid>
            )}
        </>
    );
};

export default ProductDetails;