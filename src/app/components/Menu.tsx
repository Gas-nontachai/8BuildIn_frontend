import { useState } from "react";
import Link from "next/link";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, IconButton, Divider } from "@mui/material";
import {
    Home as HomeIcon,
    Lock as LockIcon,
    People as PeopleIcon,
    Person as PersonIcon,
    Business,
    Inventory,
    Build as BuildIcon,
    ExpandLess,
    ExpandMore,
    Home,
    Store,
    Storefront,
    Badge,
    ManageAccounts,
    Outbound,
    Gavel,
    Timeline,
    ReceiptLong,
    ListAlt,
    Assignment
} from "@mui/icons-material";


export default function SidebarMenu() {
    const [openCus, setOpenCus] = useState(false);
    const [openStock, setOpenStock] = useState(false);
    const [openEmp, setOpenEmp] = useState(false);
    const [openAcc, setOpenAcc] = useState(false);
    const [openSale, setOpenSale] = useState(false);
    const [openPRPO, setOpenPRPO] = useState(false);

    const [openMaterial, setOpenMaterial] = useState(false);
    const [openProduct, setOpenProduct] = useState(false);

    const Employee = [
        { text: "พนักงาน", href: "/employee", icon: <Badge /> },
    ];

    const Customer = [
        { text: "ลูกค้า", href: "/customer", icon: <ManageAccounts /> }
    ];

    const Account = [
        { text: "หนักหลัก", href: "/", icon: <Home /> },
    ];

    const StockStore = [
        // { text: "รายงานสโตร์", href: "/dash-stock", icon: <Timeline /> },
        { text: "บันทึกสต็อกเข้า", href: "/stock-in", icon: <Inventory /> },
        { text: "เบิกสินค้าออก", href: "/stock-out", icon: <Outbound /> },
        { text: "ผู้จัดจำหน่าย", href: "/supplier", icon: <Business /> }
    ];

    const MenuList = [
        { text: "หนักหลัก", href: "/", icon: <Home /> },
    ];

    const Product = [
        { text: "ข้อมูลสินค้า", href: "/product", icon: <Store /> },
    ];

    const Material = [
        { text: "ข้อมูลวัสดุ", href: "/material", icon: <Gavel /> },
    ];

    const Sale = [
        { text: "ฝ่ายขาย", href: "/sales", icon: <Storefront /> },
    ];
    const PRPOList = [
        { text: "ใบขอซื้อ", href: "/purchase-request", icon: <Assignment /> },
        { text: "ใบสั่งซื้อ", href: "/purchase-order", icon: <ReceiptLong /> },
        { text: "ใบขอซื้อและใบสั่งซื้อ", href: "/pr-po-list", icon: <ListAlt /> }
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

            {/* เมนูจัดซื้อ */}
            <ListItem disablePadding>
                <ListItemButton onClick={() => setOpenPRPO(!openPRPO)}>
                    <ListItemText primary="เมนูจัดซื้อ" />
                    <IconButton edge="end">
                        {openPRPO ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </ListItemButton>
            </ListItem>
            <Collapse in={openPRPO} timeout="auto" unmountOnExit>
                {PRPOList.map((item) => (
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

            {/* เมนูพนักงาน */}
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
        </List >
    );
}
