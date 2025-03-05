import { useState } from "react";
import Link from "next/link";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, IconButton, Divider } from "@mui/material";
import {
    Home as HomeIcon,
    Lock as LockIcon,
    People as PeopleIcon,
    Person as PersonIcon,
    Store as StoreIcon,
    Inventory as InventoryIcon,
    Build as BuildIcon,
    ExpandLess,
    ExpandMore,
    Home,
    Store,
    Inventory,
    Dashboard,
    Engineering,
    Inventory2,
    Storage,
    SupportAgent,
    Badge,
    Security,
    ManageAccounts,
    Shield
} from "@mui/icons-material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";


export default function SidebarMenu() {
    const [openCus, setOpenCus] = useState(false);
    const [openStock, setOpenStock] = useState(false);
    const [openEmp, setOpenEmp] = useState(false);
    const [openAcc, setOpenAcc] = useState(false);
    const [openSale, setOpenSale] = useState(false);

    const [openMaterial, setOpenMaterial] = useState(false);
    const [openProduct, setOpenProduct] = useState(false);

    const Employee = [
        { text: "พนักงาน", href: "/employee", icon: <Badge /> },
    ];

    const Customer = [
        { text: "ลูกค้า", href: "/customer", icon: <ManageAccounts /> }
    ];

    const Account = [
        { text: "ผู้จัดจำหน่าย", href: "/supplier", icon: <StoreIcon /> }
    ];

    const StockStore = [
        { text: "บันทึกสต็อกเข้า", href: "/stock-in", icon: <Inventory2OutlinedIcon /> },
        { text: "เบิกสินค้าออก", href: "/stock-out", icon: <ShoppingCartOutlinedIcon /> }
    ];

    const MenuList = [
        { text: "หนักหลัก", href: "/", icon: <Home /> },
    ];

    const Product = [
        { text: "ข้อมูลสินค้า", href: "/product", icon: <Inventory /> },
    ];

    const Material = [
        { text: "ข้อมูลวัสดุ", href: "/material", icon: <Store /> },
    ];

    const Sale = [
        { text: "ฝ่ายขาย", href: "/sales", icon: <SupportAgent /> },
    ];

    return (
        <List>
            {MenuList.map((item) => (
                <ListItem key={item.text} disablePadding>
                    <ListItemButton component="a" href={item.href}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
            ))}
            {/* Manage Emp */}
            <ListItem disablePadding>
                <ListItemButton onClick={() => setOpenEmp(!openEmp)}>
                    <ListItemText primary="เมนูพนักงาน" />
                    <IconButton edge="end">
                        {openEmp ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </ListItemButton>
            </ListItem>
            <Collapse in={openEmp} timeout="auto" unmountOnExit>
                {Employee.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <Link href={item.href} passHref legacyBehavior>
                            <ListItemButton component="a">
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
                <Divider />
            </Collapse>

            {/* Manage sale */}
            <ListItem disablePadding>
                <ListItemButton onClick={() => setOpenSale(!openSale)}>
                    <ListItemText primary="เมนูฝ่ายขาย" />
                    <IconButton edge="end">
                        {openSale ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </ListItemButton>
            </ListItem>
            <Collapse in={openSale} timeout="auto" unmountOnExit>
                {Sale.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <Link href={item.href} passHref legacyBehavior>
                            <ListItemButton component="a">
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
                <Divider />
            </Collapse>

            {/* Manage Stock */}
            <ListItem disablePadding>
                <ListItemButton onClick={() => setOpenStock(!openStock)}>
                    <ListItemText primary="เมนูสต็อกสินค้า" />
                    <IconButton edge="end">
                        {openStock ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </ListItemButton>
            </ListItem>
            <Collapse in={openStock} timeout="auto" unmountOnExit>
                {StockStore.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <Link href={item.href} passHref legacyBehavior>
                            <ListItemButton component="a">
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
                <Divider />
                {/* สินค้า */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => setOpenProduct(!openProduct)} sx={{ pt: 0, pb: 0 }}>
                        <ListItemText primary="เมนูสินค้า" />
                        <IconButton edge="end">
                            {openProduct ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </ListItemButton>
                </ListItem>
                <Collapse in={openProduct} timeout="auto" unmountOnExit>
                    {Product.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <Link href={item.href} passHref legacyBehavior>
                                <ListItemButton component="a" sx={{ pt: 1, pb: 1 }}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </Collapse>
                <Divider />

                {/* วัสดุ */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => setOpenMaterial(!openMaterial)} sx={{ pt: 0, pb: 0 }}>
                        <ListItemText primary="เมนูวัสดุ" />
                        <IconButton edge="end">
                            {openMaterial ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </ListItemButton>
                </ListItem>
                <Collapse in={openMaterial} timeout="auto" unmountOnExit>
                    {Material.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <Link href={item.href} passHref legacyBehavior>
                                <ListItemButton component="a" sx={{ pt: 1, pb: 1 }}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </Collapse>
                <Divider />
            </Collapse>

            {/* Manage Customer */}
            <ListItem disablePadding>
                <ListItemButton onClick={() => setOpenCus(!openCus)}>
                    <ListItemText primary="เมนูลูกค้า" />
                    <IconButton edge="end">
                        {openCus ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </ListItemButton>
            </ListItem>
            <Collapse in={openCus} timeout="auto" unmountOnExit>
                {Customer.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <Link href={item.href} passHref legacyBehavior>
                            <ListItemButton component="a">
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
                <Divider />
            </Collapse>

            {/* Manage Acc */}
            <ListItem disablePadding>
                <ListItemButton onClick={() => setOpenAcc(!openAcc)}>
                    <ListItemText primary="เมนูบัญชี" />
                    <IconButton edge="end">
                        {openAcc ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </ListItemButton>
            </ListItem>
            <Collapse in={openAcc} timeout="auto" unmountOnExit>
                {Account.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <Link href={item.href} passHref legacyBehavior>
                            <ListItemButton component="a">
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
                <Divider />
            </Collapse>
        </List >
    );
}
