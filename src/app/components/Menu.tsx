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
    AcUnit,
    SupportAgent,
    Badge,
    Security
} from "@mui/icons-material";


export default function SidebarMenu() {
    const [openCus, setOpenCus] = useState(false);
    const [openStock, setOpenStock] = useState(false);
    const [openEmp, setOpenEmp] = useState(false);
    const [openAcc, setOpenAcc] = useState(false);
    const [openSale, setOpenSale] = useState(false);

    const [openMaterial, setOpenMaterial] = useState(false);
    const [openProduct, setOpenProduct] = useState(false);

    const Employee = [
        { text: "หน้าหลัก", href: "/dashboard-employee", icon: <Dashboard /> },
        { text: "จัดสิทธิ์การเข้าถึง", href: "/permission", icon: <LockIcon /> },
        { text: "บทบาท", href: "/license", icon: <Security /> },
        { text: "พนักงาน", href: "/employee", icon: <Badge /> },
        { text: "ฝายขาย", href: "/sales", icon: <PeopleIcon /> },
    ];

    const Customer = [
        { text: "หน้าหลัก", href: "/dash-cus", icon: <Dashboard /> },
        { text: "ลูกค้า", href: "/customer", icon: <SupportAgent /> }
    ];

    const Account = [
        { text: "หน้าหลัก", href: "/dash-acc", icon: <Dashboard /> },
        { text: "ผู้จัดจำหน่าย", href: "/supplier", icon: <StoreIcon /> }
    ];

    const StockStore = [

        { text: "หน้าหลัก", href: "/dashboard-stock", icon: <Dashboard /> },
        { text: "บันทึกสินค้าเข้า", href: "/stock-in", icon: <Inventory2 /> },
        { text: "เบิกสินค้าออก", href: "/stock-out", icon: <Engineering /> },
        { text: "จัดการหน่วยสินค้า", href: "/unit", icon: <AcUnit /> },
    ];

    const MenuList = [
        { text: "หนักหลัก", href: "/", icon: <Home /> },
    ];

    const Product = [
        { text: "แดชบอร์ด", href: "/dashboard-product", icon: <Dashboard /> },
        { text: "สินค้า", href: "/product", icon: <Inventory /> },
    ];

    const Material = [
        { text: "แดชบอร์ด", href: "/dashboard-material", icon: <Dashboard /> },
        { text: "จัดการวัสดุ", href: "/material", icon: <Store /> },
    ];

    const Sale = [
        { text: "หน้าหลัก", href: "/", icon: <Dashboard /> },
        { text: "ฝ่ายขาย", href: "/", icon: <SupportAgent /> },
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
                    <ListItemButton onClick={() => setOpenProduct(!openProduct)} >
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
                                <ListItemButton component="a" sx={{ pl: 4 }}>
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
                    <ListItemButton onClick={() => setOpenMaterial(!openMaterial)} >
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
                                <ListItemButton component="a" sx={{ pl: 4 }}>
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
        </List >
    );
}
