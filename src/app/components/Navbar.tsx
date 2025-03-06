"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import {
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  MenuItem,
  Menu,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout,
  PersonOutlined,
  ShoppingCart,
  Delete,
} from "@mui/icons-material";
import { AuthProvider } from "@/context/AuthContext";
import { API_URL } from "@/utils/config";
import { useCart } from "@/hooks/hooks";
import { CartItemWithProduct, Cart } from "@/misc/cart";
import { Product } from "@/misc/product";
import { useProduct } from "@/hooks/hooks";
import { decimalFix } from "@/utils/number-helper";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
}));

export default function Navbar({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  const { $profile } = AuthProvider();
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = AuthProvider();
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const { getCartBy, deleteCartBy } = useCart();
  const { getProductByID } = useProduct();

  useEffect(() => {
    if (pathname.includes("/sales")) {
      fetchCartItems();
    }
  }, [pathname]);

  const fetchCartItems = async () => {
    try {
      const { docs } = await getCartBy({
        addby: $profile.employee_id,
        cart_status: "0"
      });

      // ดึงข้อมูลสินค้าสำหรับแต่ละรายการในตะกร้า
      const cartWithProducts = await Promise.all(
        docs.map(async (item: CartItemWithProduct) => {
          try {
            const productData = await getProductByID({
              product_id: item.product_id
            });
            return {
              ...item,
              product: productData
            };
          } catch (error) {
            console.error(`Error fetching product ${item.product_id}:`, error);
            return item;
          }
        })
      );

      setCartItems(cartWithProducts as CartItemWithProduct[]);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleDeleteItem = async (cart_id: string) => {
    try {
      await deleteCartBy({ cart_id });
      await fetchCartItems();
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleViewCart = () => {
    router.push('/sales/cart-details'); 
  };

  return (
    <AppBar position="fixed" open={open} sx={{ backgroundColor: "#262626" }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setOpen(true)}
          edge="start"
          sx={{ mr: 2, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        {!open && (
          <Typography variant="h6" noWrap component="div">
            <img src="/logo.jpg" alt="Logo" className="rounded-md" style={{ width: "auto", height: "40px" }} />
          </Typography>
        )}
        <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
          {pathname.includes("/sales") && (
            <>
              <IconButton
                color="inherit"
                onMouseEnter={(e) => setCartAnchorEl(e.currentTarget)}
                
              >
                <Badge badgeContent={cartItems.length} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={cartAnchorEl}
                open={Boolean(cartAnchorEl)}
                onClose={() => setCartAnchorEl(null)}
              >
                {cartItems.length === 0 ? (
                  <MenuItem>
                    <Typography>ไม่มีสินค้าในตะกร้า</Typography>
                  </MenuItem>
                ) : (
                  <div> 
                    {cartItems.map((item) => (
                      <MenuItem key={item.cart_id} onClick={handleViewCart}>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                          alignItems: 'center'
                        }}>
                          <Typography>
                            {item.product?.product_name} x {item.cart_amount}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteItem(item.cart_id!)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem>
                      <Box sx={{ width: '100%' }}>
                        <Typography>
                          รวมทั้งหมด: {cartItems.length} รายการ
                        </Typography>
                        <Typography variant="h6" color="primary">
                          ราคารวม: {decimalFix(
                            cartItems.reduce((total, item) =>
                              total + (decimalFix(item.product?.product_price || 0) * decimalFix(item.cart_amount)),
                              0
                            ).toString()
                          )} บาท
                        </Typography>
                      </Box>
                    </MenuItem>
                  </div>
                )}
              </Menu>
            </>
          )}
          <IconButton color="inherit" sx={{ ml: 2 }}>
            <Badge showZero={false}>
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 2 }}>
            <Badge showZero={false}>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 2 }} onClick={handleClick}>
            {$profile.employee_img ? (
              <img
                className="w-9 h-9 rounded-full"
                src={`${API_URL}${$profile.employee_img}`}
                alt="img_profile"
              />
            ) : (
              <AccountCircleIcon className="w-9 h-9" />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => router.push(`/profile?id=${$profile.employee_id}`)}>
              <PersonOutlined sx={{ mr: 1 }} />
              <Typography>โปรไฟล์</Typography>
            </MenuItem>
            <MenuItem onClick={() => logout()}>
              <Logout sx={{ mr: 1 }} />
              <Typography>ออกจากระบบ</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}